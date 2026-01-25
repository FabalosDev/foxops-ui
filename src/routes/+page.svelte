<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient';

  let requestId: string | null = null;
  let status = 'CONNECTING'; // CONNECTING, ANALYZING, INTERACTION, RESOLVED
  let incidentData: any = null;
  let userReply = '';

  // 1. Initialize on Load
  onMount(async () => {
    // Get ID from URL (e.g., foxops.fabalos.com?req_id=123)
    requestId = $page.url.searchParams.get('req_id');

    if (!requestId) {
      status = 'ERROR_NO_ID';
      return;
    }

    status = 'ANALYZING';

    // 2. Fetch initial state (Did Make already log the error?)
    const { data } = await supabase
      .from('incidents')
      .select('*')
      .eq('request_id', requestId)
      .single();

    if (data) {
      incidentData = data;
      handleStatusChange(data.status);
    }

    // 3. LISTEN TO REALTIME UPDATES (The Magic)
    const channel = supabase
      .channel('incident-room')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'incidents',
          filter: `request_id=eq.${requestId}`
        },
        (payload) => {
          console.log('Update received!', payload);
          incidentData = payload.new;
          handleStatusChange(payload.new.status);
        }
      )
      .subscribe();
  });

  function handleStatusChange(newStatus: string) {
    // If Make.com changes status to 'ACTION_REQUIRED', we show the chat
    if (newStatus === 'ACTION_REQUIRED') {
      status = 'INTERACTION';
    } else if (newStatus === 'RESOLVED') {
      status = 'RESOLVED';
    }
  }

  async function sendReply() {
    if (!requestId) return;

    // We don't talk to Gemini directly. We write to DB.
    // Make.com sees this update and triggers Gemini.
    const { error } = await supabase
      .from('incidents')
      .update({
        user_input: userReply,
        status: 'USER_REPLIED' // Tells Make to wake up
      })
      .eq('request_id', requestId);

    if (!error) {
      status = 'WAITING_FOR_AI';
      userReply = '';
    }
  }
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-mono">

  <div class="mb-8 text-center">
    <h1 class="text-2xl font-bold text-emerald-400 tracking-widest">FOXOPS // SENTINEL</h1>
    <p class="text-xs text-gray-500 mt-2">SESSION ID: {requestId || 'UNKNOWN'}</p>
  </div>

  {#if status === 'ANALYZING'}
    <div class="animate-pulse text-yellow-500">
      [SCANNING SYSTEM LOGS...]
    </div>

  {:else if status === 'INTERACTION'}
    <div class="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl">
      <div class="flex gap-4 mb-6">
        <div class="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xs">AI</div>
        <div class="bg-gray-700 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg text-sm text-gray-200">
          {incidentData?.ai_suggestion || "I detected an issue with your submission. Did you mean to use a different email domain?"}
        </div>
      </div>

      <div class="flex gap-2">
        <input
          type="text"
          bind:value={userReply}
          placeholder="Type your correction..."
          class="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          on:click={sendReply}
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors">
          SEND
        </button>
      </div>
    </div>

  {:else if status === 'RESOLVED'}
    <div class="text-center">
      <div class="text-5xl mb-4">✅</div>
      <h2 class="text-xl font-bold text-white">ISSUE RESOLVED</h2>
      <p class="text-gray-400 text-sm mt-2">Resuming your onboarding process...</p>
    </div>
  {/if}

</div>