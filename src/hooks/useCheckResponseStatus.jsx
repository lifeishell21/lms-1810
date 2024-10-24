import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useCheckResponseStatus = () => {
  const navigate = useNavigate();

  const checkResponseStatus = (response) => {
    if (response.status === 203 || response.status === 401) {
      console.log("hit");
      // Clear cookies and localStorage
      Cookies.remove("token");
      Cookies.remove("uData");
      Cookies.remove("AESDecKey");
      localStorage.clear();

      // Redirect to session timeout page
      navigate("/sessiontimeout");
    } else {
      // Return response data if status is not 203 or 401
      console.log("Response from backend:----------", response.data);
      return response.data;
    }
  };

  return { checkResponseStatus };
};

export default useCheckResponseStatus;
