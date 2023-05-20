export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? '!!@ChangeMe123@!!',
  signOptions: {
    expiresIn: '24h',
  },
};
