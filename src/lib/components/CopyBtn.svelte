<script lang="ts">
  export let message: string;

  let justCopied = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function copyMessage() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    void navigator.clipboard.writeText(message);
    justCopied = true;
    timeoutId = setTimeout(() => {
      justCopied = false;
    }, 2000);
  }
</script>

<slot {justCopied} {copyMessage} />
