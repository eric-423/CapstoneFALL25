export const createMockJWT = (userId: number, phone: string, role: string) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: userId,
      phoneNumber: phone,
      role: role,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  );
  const signature = "mock_signature";
  return `${header}.${payload}.${signature}`;
};
