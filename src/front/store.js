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
      auth_company: false
  }
}
export const getUserRole = (store) => {
  if (store.admin_token) return "admin";
  if (store.company_token) return "company";
  if (store.client_token) return "client";
  return null; // User not login
};

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

      case 'set_auth_company':
      return {
        ...store,
        auth_company: action.payload
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
