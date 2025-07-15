chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractConnections") {
    const max = parseInt(request.max) || Infinity;
    const connections = [];

    document.querySelectorAll('li.mn-connection-card').forEach(card => {
      if (connections.length >= max) return;

      const name = card.querySelector('.mn-connection-card__name')?.innerText.trim() || '';
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const jobTitle = card.querySelector('.mn-connection-card__occupation')?.innerText.trim() || '';

      connections.push({ firstName, lastName, headline: jobTitle });
    });

    console.log('Extracted connections:', connections);
    chrome.storage.local.set({ csvData: connections });
    sendResponse({ status: "done", count: connections.length });
  }
  return true;
});
