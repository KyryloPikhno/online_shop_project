import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";

import {authService} from "../../services";
import css from './Login.module.css';


const Login = () => {
    const {register, handleSubmit} = useForm()

    const navigate = useNavigate()

    const [query] = useSearchParams()

    // const dispatch = useDispatch();

    let submit = async (user) => {
        try {
            const {data} = await authService.login(user)

            console.log(data.user);

            authService.setTokens(data)

            navigate('/devices')
        } catch (e) {
            console.log(e.message)
        }
    }
    return (
        <div className={css.container}>
            {query.has('expSession') && <h1>session end</h1>}

            <form className={css.form} onSubmit={handleSubmit(submit)}>
                <input type='text' placeholder={'email'} {...register('email')}/>
                <input type='text' placeholder={'password'} {...register('password')}/>
                <button>Login</button>
                <div className={css.link}>
                    No account yet?<NavLink to={'/register'}>Sign up</NavLink>
                </div>
            </form>
        </div>
    );
};

export {Login};