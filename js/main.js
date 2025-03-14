// Shared functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any shared components or functionality
    initializePageTransitions();
});

function initializePageTransitions() {
    // Add transition class to body when navigating
    document.querySelectorAll('a').forEach(link => {
        if (link.href && !link.href.includes('#')) {
            link.addEventListener('click', function(e) {
                document.body.classList.add('page-transition');
            });
        }
    });
} 