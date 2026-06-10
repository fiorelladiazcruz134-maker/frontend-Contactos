import { mockUsers } from '../mocks/users';

export const authService = {
  /**
   * Simula el consumo de un endpoint /api/auth/login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulamos un retraso de red de 800ms
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // Extraemos la contraseña para no devolverla en la respuesta
          const { password: _, ...userWithoutPassword } = user;

          // Generamos un token JWT falso
          const token = `fake-jwt-token-${user.id}-${Date.now()}`;

          resolve({
            token,
            user: userWithoutPassword
          });
        } else {
          reject(new Error('Credenciales incorrectas. Verifique su correo o contraseña.'));
        }
      }, 800);
    });
  }
};
