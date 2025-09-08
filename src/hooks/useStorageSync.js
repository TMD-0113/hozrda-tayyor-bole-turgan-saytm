import { useEffect } from 'react'
export default function useStorageSync(onTasksUpdated){
  useEffect(()=> {
    const bc = new BroadcastChannel('tasker_channel')
    bc.onmessage = (ev) => {
      if (ev.data?.type==='tasks-updated') onTasksUpdated && onTasksUpdated()
      if (ev.data?.type==='ping' || ev.data?.type==='logout') window.dispatchEvent(new Event('presence-update'))
    }
    return ()=> bc.close()
  },[])
}
