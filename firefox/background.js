const copyMarkdownLink = async (tab) => {
    const title = tab.title;
    const url = tab.url;
    const markdown = `[${title}](${url})`;

    await browser.tabs.executeScript(tab.id, {
        code: `
            navigator.clipboard
                .writeText(${JSON.stringify(markdown)})
                .then(() => {
                    console.log('Copied!');
                    const toast = document.createElement('div');
                    toast.textContent = 'Markdownリンクをコピーしました！';
                    Object.assign(toast.style, {
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        zIndex: 10000,
                        fontSize: '14px',
                        fontFamily: 'sans-serif',
                    });
                    document.body.appendChild(toast);
                    setTimeout(() => {
                        toast.remove();
                    }, 2000);
                })
                .catch((err) => {
                    console.error('Clipboard error: ', err);
                });
        `
    });
};

browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: 'copy_markdown_link',
        title: 'Markdownリンクをコピー',
        contexts: ['page'],
    });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'copy_markdown_link') {
        copyMarkdownLink(tab);
    }
});

browser.commands.onCommand.addListener((command) => {
    if (command === 'copy_markdown_link') {
        browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
            copyMarkdownLink(tab);
        });
    }
});

browser.action.onClicked.addListener(copyMarkdownLink);
