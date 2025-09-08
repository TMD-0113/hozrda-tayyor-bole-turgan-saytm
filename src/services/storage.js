export function read(key, fallback=null){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch(e){return fallback} }
export function write(key, val){ localStorage.setItem(key, JSON.stringify(val)) }

export function getTasks(){ return read('tasks', []) }
export function saveTasks(list){ write('tasks', list); new BroadcastChannel('tasker_channel').postMessage({type:'tasks-updated'}) }

export function getComments(){ return read('comments', []) }
export function saveComments(list){ write('comments', list); new BroadcastChannel('tasker_channel').postMessage({type:'tasks-updated'}) }

export function addTask(t){
  const tasks = getTasks()
  tasks.unshift(t)
  saveTasks(tasks)
}
export function addComment(c){
  const comments = getComments()
  comments.push(c); saveComments(comments)
}
