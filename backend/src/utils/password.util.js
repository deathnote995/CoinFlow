export const validatePassword = (password) => {
    if (typeof password !== 'string')
        return "Please provide a valid password"
    if (password.length < 8)
        return "Password must be atleast 8 characters long"
    if (Buffer.byteLength(password, 'utf-8') > 72)
        return "Password should not exceed 72 bytes"
    if (!/[A-Z]/.test(password))
        return "Password must contain atleast one Uppercase letter"
    if (!/[a-z]/.test(password)) 
        return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) 
        return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9\s]/.test(password)) 
        return 'Password must contain at least one special character';

    return null;
}