

const init = () => {

    const form = document.getElementById('github-form')
    const search = document.getElementById('search')
    const userList = document.getElementById('user-list')
    let repoList = document.getElementById('repos-list')
    
    let userName;
    
    
    search.addEventListener('input', function (e) {
       const inputValue = e.target.value
       userName = inputValue
    })
    
    form.addEventListener('submit', function (e) {
       e.preventDefault()
          const userUrl = `https://api.github.com/search/users?q=${userName || ''}`
          getUsers(userUrl)
          clearInput()
    })
    
    function clearInput() {
       search.value = ''
    }
    
    async function getUsers(user) {
       try {
          const r = await fetch(user, {
             headers: {
                Accept: 'application/vnd.github.v3+json',
             },
          })
          if(!r.ok || !user) {
             throw new Error ('FAIL: Nothing to see here')
          }
          const data = await r.json()
          renderList(data)
       }catch(error) { console.error('this is a console error, buddy: ', error)}
    }
    
    function renderList(users) {
      const list =  users.items.map(item => (
      `<tr key=${item.id}>
      <td>${item.login}</td>
          <td>
          <button id='${item.login}' class='go' type='button'> 
          Repo
          </button></td>
          </tr>`
    ))
    
       userList.innerHTML =
      ` <table>
          <thead>
             <tr>
             <th>User</th>
             <th>Repo</th>
             </tr>
          </thead>
          <tbody>
    ${list.join('')}
          </tbody>
       </table>`
    }
    
    userList.addEventListener('click', function (e) {
       const { id } = e.target
    const repoUrl = `https://api.github.com/users/${id || ''}/repos`
    id ? fetchRepos(repoUrl) : console.error('cannot find repo')
    })
    
    
    async function fetchRepos(url) {
       try {
          const r = await fetch(url);
          if (!r.ok) {
             throw new Error('FAIL');
          }
          const data = await r.json();
      
          renderRepos(data);
       } catch (error) {
          console.error(error);
       }
    }
    
    function renderRepos(data) {
       const repos = data.map(item => (
          `<li id=${item.id}>${item.name}</li>`
       ))
       console.log(repos);
       repoList.innerHTML = repos.join('')
    }}
    
    window.addEventListener('DOMContentLoaded', init)
    