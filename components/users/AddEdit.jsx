import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Titulo es obligatorio'),
        firstName: Yup.string()
            .required('Nombre es obligatorio'),
        lastName: Yup.string()
            .required('Apellido es obligatorio'),
        email: Yup.string()
            .email('Email es invalido')
            .required('Email es obligatorio'),
        role: Yup.string()
            .required('Rol es obligatorio'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Contraseña es obligatoria') : null)
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .when('password', (password, schema) => {
                if (password || isAddMode) return schema.required('La confirmacion de la contraseña es obligatoria');
            })
            .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        const { password, confirmPassword, ...defaultValues } = user;
        formOptions.defaultValues = defaultValues;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        return userService.create(data)
            .then(() => {
                alertService.success('Usuario Agregado', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.update(id, data)
            .then(() => {
                alertService.success('Usuario Actualizado', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>{isAddMode ? 'Agregar Usuario' : 'Editar Usuario'}</h1>
            <div className="form-row">
                <div className="form-group col">
                    <label>Titulo</label>
                    <select name="title" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`}>
                        <option value=""></option>
                        <option value="Sr">Sr.</option>
                        <option value="Sra">Sra.</option>
                        <option value="Srta">Srta.</option>                        
                    </select>
                    <div className="invalid-feedback">{errors.title?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Nombre(s)</label>
                    <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Apellidos</label>
                    <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Email</label>
                    <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Rol</label>
                    <select name="role" {...register('role')} className={`form-control ${errors.role ? 'is-invalid' : ''}`}>
                        <option value=""></option>
                        <option value="User">Usuario</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <div className="invalid-feedback">{errors.role?.message}</div>
                </div>
            </div>
            {!isAddMode &&
                <div>
                    <h3 className="pt-3">Cambiar Contraseña</h3>
                    <p>Dejar en blanco para conservar la misma contraseña</p>
                </div>
            }
            <div className="form-row">
                <div className="form-group col">
                    <label>
                        Constraseña
                        {!isAddMode &&
                            (!showPassword
                                ? <span> - <a onClick={() => setShowPassword(!showPassword)} className="text-primary">Mostrar</a></span>
                                : <em> - {user.password}</em>
                            )
                        }
                    </label>
                    <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Confirmar Contraseña</label>
                    <input name="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                </div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Guardar
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Limpiar</button>
                <Link href="/users" className="btn btn-link">Cancelar</Link>
            </div>
        </form>
    );
}