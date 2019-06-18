import api from './api'; //importando 

class App {

    constructor (){
        this.repositories = [];

        this.formEl  = document.getElementById('repo-form');
        this.listEl  = document.getElementById('repo-list');
        this.inputEl = document.querySelector('input[name=repository]');
        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.searchRepository(event);
    }

    setLoading(loading = true){ //message loading
        if (loading === true){
            let loadingEl = document.createElement('span');
                loadingEl.appendChild(document.createTextNode('Carregando...'));
                loadingEl.setAttribute('id', 'loading');

            this.formEl.appendChild(loadingEl);
        }else{
            document.getElementById('loading').remove();
        }
    }

    async searchRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if (repoInput.length === 0)
            return;

        this.setLoading(); //loading

        try {
            const response = await api.get(`/repos/${repoInput}`); //buscando repositório usando "axios"

            const { name, description, html_url, owner: { avatar_url } } = response.data; //conceito de desestruturação 

            this.repositories.push({ //adicionando no array
                name,
                description,
                avatar_url,
                html_url
            });

            this.inputEl.value = '';
            
            this.render();
        }catch (err) {
            alert('O repositório não existe!');
        }

        this.setLoading(false);
    }

    render(){
        this.listEl.innerHTML = '';

        this.repositories.forEach(repo => { // looping 
            let imgEl = document.createElement('img');
                imgEl.setAttribute('src', repo.avatar_url);
            
            let titleEl = document.createElement('strong');
                titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
                descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
                linkEl.setAttribute('href', repo.html_url);
                linkEl.setAttribute('target', '_blank');
                linkEl.appendChild(document.createTextNode('Acessar'));

            let listItemEL = document.createElement('li');
                listItemEL.appendChild(imgEl);
                listItemEL.appendChild(titleEl);
                listItemEL.appendChild(descriptionEl);
                listItemEL.appendChild(linkEl);

            this.listEl.appendChild(listItemEL);
        });
    }
}

new App(); //instanciando