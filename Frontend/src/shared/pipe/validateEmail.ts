export const validateEmail = (email: string) => {
    // Regular expression to validate email format
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };