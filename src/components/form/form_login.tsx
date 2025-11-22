import { useNavigate } from "react-router-dom";
import { submitLoginForm } from "../../functions/login";
import { useAuth } from "../../models/model-all";

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await submitLoginForm(e, navigate, auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-xl w-full max-w-md space-y-5 border border-blue-100"
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
        Đăng nhập hệ thống
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Tài khoản</label>
        <input
          type="text"
          name="username"
          placeholder="Nhập tài khoản..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/80 
                     focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
        <input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/80
                     focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                   rounded-lg font-medium shadow-md hover:opacity-95 transition active:scale-95"
      >
        Đăng nhập
      </button>
    </form>
  );
}
