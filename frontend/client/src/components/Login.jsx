import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            name: !isLogin ? Yup.string().required('Name is required') : Yup.string(),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'Must contain at least one lowercase, one uppercase, one number, and one special character'
                )
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
            confirmPassword: !isLogin
                ? Yup.string()
                      .oneOf([Yup.ref('password'), null], 'Passwords must match')
                      .required('Confirm Password is required')
                : Yup.string()
        }),
        onSubmit: async (values) => {
            try {
                const endpoint = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
                const body = isLogin
                    ? { email: values.email, password: values.password }
                    : { name: values.name, email: values.email, password: values.password, confirmPassword: values.confirmPassword };

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Something went wrong');

                toast.success(data.message, { position: 'top-center' });
                resetForm();
            } catch (error) {
                toast.error(error.message, { position: 'top-center' });
            }
        }
    });

    return (
        <div style={styles.container}>
            <ToastContainer />
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>{isLogin ? 'Login' : 'Register'}</h2>

                {!isLogin && (
                    <>
                        <label style={styles.label} htmlFor="name">Name:</label>
                        <input
                            style={styles.input}
                            type="text"
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.name && touched.name && <p style={styles.error}>{errors.name}</p>}
                    </>
                )}

                <label style={styles.label} htmlFor="email">Email:</label>
                <input
                    style={styles.input}
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.email && touched.email && <p style={styles.error}>{errors.email}</p>}

                <label style={styles.label} htmlFor="password">Password:</label>
                <input
                    style={styles.input}
                    type="password"
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.password && touched.password && <p style={styles.error}>{errors.password}</p>}

                {!isLogin && (
                    <>
                        <label style={styles.label} htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            style={styles.input}
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.confirmPassword && touched.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
                    </>
                )}

                <button type="submit" style={styles.button}>{isLogin ? 'Login' : 'Register'}</button>

                <p style={styles.toggleText}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={() => setIsLogin(!isLogin)} style={styles.toggleLink}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </span>
                </p>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4'
    },
    form: {
        width: '350px',
        padding: '2rem',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: 'white',
        textAlign: 'center'
    },
    heading: {
        marginBottom: '1rem',
        fontSize: '1.5rem',
        color: '#333'
    },
    label: {
        display: 'block',
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: '10px',
        color: '#555'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1rem',
        boxSizing: 'border-box'
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginTop: '5px',
        textAlign: 'left'
    },
    button: {
        width: '100%',
        padding: '10px',
        marginTop: '15px',
        backgroundColor: '#007BFF',
        color: 'white',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s'
    },
    toggleText: {
        marginTop: '15px',
        fontSize: '0.9rem'
    },
    toggleLink: {
        color: '#007BFF',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};

export default Login;
