const loadIcons = () => {
    const width = '1.25rem'
    const height = '1.25rem'
    const color = '#837e9f'
    const strokeWidth = '0.1rem'

    feather.replace({ width: width, height: height, color: color, 'stroke-width': strokeWidth })
}
loadIcons()

fetch('https://api.github.com/users/9gabr/repos').then(async res => {
    const resArr = await res.json()
    const reposToShow = resArr.filter((repo, index) => index > resArr.length - 3)

    fetch('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then(async res => {
        const resJson = await res.json()

        reposToShow.map(repo => {
            $('.projetos-div').append(`<div class="column is-6">
            <div class="box">
                <div class="content">
                    <div class="projeto-nome">
                        <i data-feather="folder" style="margin-right: 1rem"></i>
                        <a href="${repo.html_url}" target="_blank" rel="external">
                            <p>${repo.name}</p>
                        </a>
                    </div>
                    <div class="projeto-descricao">
                        <p>${repo.description}</p>
                    </div>
                    <div class="level projeto-footer">
                        <div class="level-left">
                            <div class="level-item">
                                <i data-feather="star"></i>
                                <p>${repo.stargazers_count}</p>
                            </div>
                            <div class="level-item">
                                <i data-feather="git-branch"></i>
                                <p>${repo.forks_count}</p>
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <svg height="0.85rem" width="0.85rem">
                                    <circle cy="50%" cx="50%" r="5" fill="${resJson[repo.language].color}" class="projeto-circle"/>
                                </svg>
                                <p>${repo.language}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`)
        })
        loadIcons()
    })
}).catch(e => console.error(e))

fetch('https://api.github.com/users/9Gabr/events').then(async res => {
    const resJson = await res.json()
    const lastTwoEvents = resJson.filter((ev, index) => index < 2)

    lastTwoEvents.map(ev => {
        const eventDate = new Date(ev.created_at).toLocaleDateString('pt-BR', { hour: "numeric", minute: "numeric" }).replace(/(\d\d\d\d)/, '$1 -')
        const eventType = () => {
            if (ev.type === 'PushEvent') return { type: 'Push', message: ev.payload.commits.map(msg => msg.message) }
            if (ev.type === 'CreateEvent') return { type: 'Repositório criado:', message: [ev.payload.description] }
            if (ev.type === 'PullRequestEvent') return { type: 'Pull request:', message: [ev.payload.pull_request.title] }
            if (ev.type === 'ForkEvent') return { type: 'Fork:', message: [ev.payload.forkee.name] }
        }

        console.log(eventType())

        $('.atividades-div').append(`<div class="box">
        <article class="media">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img src="https://avatars.githubusercontent.com/u/92824047" class="atividade-foto">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h5 style="margin-top: 0.5rem; margin-bottom: 0.5rem">${ev.type === 'forkEvent' ? `<a
                            href="${ev.payload.html_url}">ev.repo.name.split('/').pop()</a>` : `<a
                            href="${ev.repo.url.replace('api.', '').replace('repos/', '')}" target="_blank"
                            rel="external">${ev.repo.name.split('/').pop()}</a>`}</h5>
                    <p style="font-size: 0.85rem">${eventDate}</p>
                    <p><strong style="color: var(--text-color)">${eventType().type}</strong>:
                        ${eventType().message.join(', ')}</p>
                </div>
            </div>
        </article>
        <div>`)
    })

    console.log(resJson)
}).catch(e => console.error(e))