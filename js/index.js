document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    githubForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm !== '') {
            const users = await searchUsers(searchTerm);
            displayUsers(users);
        }
    });

    async function searchUsers(username) {
        const response = await fetch(`https://api.github.com/search/users?q=${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        return data.items;
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        reposList.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login} Avatar">
                <p>Username: ${user.login}</p>
                <a href="${user.html_url}" target="_blank">Profile</a>
            `;
            userElement.addEventListener('click', () => {
                getAndDisplayRepos(user.login);
            });
            userList.appendChild(userElement);
        });
    }

    async function getAndDisplayRepos(username) {
        const repos = await searchReposForUser(username);
        displayRepos(repos);
    }

    function displayRepos(repos) {
        reposList.innerHTML = '';

        repos.forEach(repo => {
            const repoElement = document.createElement('li');
            repoElement.innerHTML = `
                <p>Repository: ${repo.full_name}</p>
                <p>Description: ${repo.description}</p>
                <a href="${repo.html_url}" target="_blank">Visit Repository</a>
            `;
            reposList.appendChild(repoElement);
        });
    }

    async function searchReposForUser(username) {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const repos = await response.json();
        return repos;
    }
});
