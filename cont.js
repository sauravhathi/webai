console.log('👨‍💻 Author: Saurav Hathi \n🌟 GitHub: https://github.com/sauravhathi \n🚀Linkedin: https://www.linkedin.com/in/sauravhathi');

/**
 * Watches for the presence of a YouTube ad blocker popup and removes it.
 * Also adds a "Donate" button to the video owner's profile.
 */
function watchForElement() {
  const observer = new MutationObserver(function (mutations) {
    const p = document.querySelector("div#owner");

  });

  observer.observe(document, { childList: true, subtree: true });
}

watchForElement();