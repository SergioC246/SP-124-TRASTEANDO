export const initialStore=()=>{
  const tokenClient = localStorage.getItem("tokenClient");

  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
      tokenClient: tokenClient || null,
      authClient: !!tokenClient,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
    
    case "set_auth_client": {
      const { tokenClient } = action.payload;
      return {...store, tokenClient, authClient: true};
    }

    case "logout_client":
      return { ...store, tokenClient: null, authClient: false };

  }    
}
