(function () {
    var root = document.documentElement;
    var appearance = root.dataset.appearance || 'system';

    if (appearance === 'dark') {
        root.classList.add('dark');

        return;
    }

    if (
        appearance === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        root.classList.add('dark');
    }
})();
