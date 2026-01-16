// components/FormField.jsx
import React from 'react';
import { AlertError } from '../Inputs/alertError';
import { InputFieldModal } from '../Buttons/InputFieldModal';


const FormField = ({
    name,
    label,
    type = 'text',
    required = false,
    readOnly = false,
    placeholder,
    //register,
    errors,
    clearErrors,
    value,
    onChange,
    onFocus,
    mask,
    children,
    validation = {},
    className = '',
    ...props
}) => {
    const fieldLabel = required ? `${label}*` : label;
    
    // Campo Select
    if (children) {
        return (
            <div className={`form-field ${className}`}>
                <label className="form-label">{fieldLabel}</label>
                <select 
                    className="select2 form-control"
                    {...props}
                >
                    {children}
                </select>
                {errors[name] && (
                    <AlertError
                        error={errors[name]}
                        onClose={clearErrors}
                        fieldName={name}
                    />
                )}
            </div>
        );
    }

    // Campo Input
    return (
        <div className={`form-field ${className}`}>
            <InputFieldModal
                label={fieldLabel}
                type={type}
                readOnly={readOnly}
                placeholder={placeholder}
                value={mask ? mask(value) : value}
                onChangeModal={onChange}
                onFocus={onFocus}
                {...props}
                // {...register(name, {
                //     required: required ? `${label} é obrigatório` : false,
                //     ...validation
                // })}
            />
            {errors[name] && (
                <AlertError
                    error={errors[name]}
                    onClose={clearErrors}
                    fieldName={name}
                />
            )}
        </div>
    );
};

export default FormField;