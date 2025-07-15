// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const getButton = document.getElementById('getElements');
  const exportBtn = document.getElementById('csvDownloadButton');
  const link = document.getElementById('csvDownloadLink');
  const firstNameCheckBox = document.getElementById('firstNameCheckbox');
  const lastNameCheckBox = document.getElementById('lastNameCheckbox');
  const jobCheckBox = document.getElementById('jobCheckBox');
  const numberInput = document.getElementById('numOfElements');

  getButton.addEventListener('click', () => {
    const limit = parseInt(numberInput.value);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractConnections", max: limit },
        (response) => {
          if (response?.status === "done") {
            getButton.textContent = `Extracted ${response.count} connections`;
            exportBtn.disabled = false;
            exportBtn.style.pointerEvents = 'auto';
            exportBtn.style.cursor = 'pointer';
            exportBtn.style.backgroundColor = 'dodgerblue';
          }
        }
      );
    });
  });

  exportBtn.addEventListener('click', () => {
    chrome.storage.local.get('csvData', (res) => {
      let rows = res.csvData || [];

      const csvRows = rows.map(r => {
        const cols = [];
        if (firstNameCheckBox.checked) cols.push(r.firstName);
        if (lastNameCheckBox.checked) cols.push(r.lastName);
        if (jobCheckBox.checked) cols.push(r.headline);
        return cols.join(',');
      });

      const csvHeader = [
        firstNameCheckBox.checked ? 'firstName' : '',
        lastNameCheckBox.checked ? 'lastName' : '',
        jobCheckBox.checked ? 'headline' : ''
      ].filter(Boolean).join(',');

      const csv = csvHeader + "\n" + csvRows.join("\n");

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.click();
    });
  });
});
