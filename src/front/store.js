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

    auth_admin: false,
    admin_token: localStorage.getItem("admin_token") || null,
    admin_info: JSON.parse(localStorage.getItem("admin_info")) || null
  };
};

      tokenClient: tokenClient || null,
      authClient: !!tokenClient,
      auth_company: false
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'set_auth_admin':
        return {...store, auth_admin: action.payload };

    case 'set_admin_login':
        localStorage.setItem("admin_token", (action.payload.token));
        return {
          ...store,
          admin_token: action.payload.token,
          admin_info: action.payload.admin,
          auth_admin: true
        };

    case 'logout_admin':
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_info");
        return {
          ...store,
          admin_token: null,
          admin_info: null,
          auth_admin: false
        };

    case 'set_admin_info':
      return {...store, admin_info: action.payload, auth_admin: true };
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
