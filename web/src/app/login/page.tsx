import { loginAction } from "../actions/auth";

export default function Login() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-blue-900 rounded-lg p-8">
        <h1 className="text-3xl text-white mb-8">Login</h1>

        <form action={loginAction} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm text-gray-300 mb-2">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full bg-black border border-blue-900 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-black border border-blue-900 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}