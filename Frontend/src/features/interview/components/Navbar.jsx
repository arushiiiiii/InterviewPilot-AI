import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { LogOut } from "lucide-react";
import "../../../style/navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const logout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <button
      className="logout-btn"
      onClick={logout}
    >
      <LogOut size={18} />
      Logout
    </button>
  );
};

export default Navbar;