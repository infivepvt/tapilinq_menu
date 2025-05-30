import { createContext, useContext, useEffect, useState } from "react";
import api, {
  setAccessToken as setGlobalAccessToken,
  setSessionId as setGlobalSessionId,
  getAccessToken,
  getSessionId,
  logout as apiLogout,
} from "../api/axios";
import { REFRESH_URL } from "../api/urls";

const AuthContext = createContext<any>(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [sessionId, setSessionId] = useState(getSessionId());
  const [loading, setLoading] = useState(true);
  const [unreadChats, setUnreadChats] = useState([]);

  // Sync local state with global state
  const syncAccessToken = (token: any) => {
    setAccessToken(token);
    setGlobalAccessToken(token); // Update global state
  };

  const syncSessionId = (id: any) => {
    setSessionId(id);
    setGlobalSessionId(id); // Update global state
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (sessionId) {
        try {
          const { data } = await api.post(REFRESH_URL, { sessionId });
          syncAccessToken(data.token);
          setUser(data.user);
        } catch (err) {
          console.error("Auth check failed", err);
          setUser(null);
          syncAccessToken(null);
          syncSessionId(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [sessionId]);

  const logout = async (allDevices = false) => {
    try {
      await apiLogout(allDevices); // Use global logout
    } catch (err) {
      console.error("Logout failed", err);
    }
    setUser(null);
    syncAccessToken(null);
    syncSessionId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          logout,
          loading,
          accessToken,
          sessionId,
          api,
          syncAccessToken,
          syncSessionId,
          unreadChats,
          setUnreadChats,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
};
