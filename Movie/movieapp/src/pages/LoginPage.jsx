import React, { useContext } from "react";
import styled from "styled-components"; 
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../hooks/LoginContext';

const LoginPageBack = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: rgba(3, 37, 65, 1);
    color: white;
`

const LoginPageTitle = styled.h2`
    padding: 20px;
    text-align: center;
`

const InputPart = styled.input`
    width: 400px;
    border-radius: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    font-size: 1rem;
    margin-bottom: 10px;
`

const LoginValidate = styled.div`
    width: 400px;
    height: 40px;
    color: red;
    margin-left: 5px;
    margin-bottom: 10px;
    white-space: nowrap;
`

const LoginButton = styled.button`
    width: 400px;
    height: 50px;
    border-radius: 30px;
    margin-bottom: 30px;
`

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(LoginContext);  // LoginContext에서 login 함수를 가져옴

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm({mode: 'onChange'});

    const onSubmit = async (formData) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.id,
                    password: formData.password
                })
            });

            if (!response.ok) {
                throw new Error('로그인에 실패했습니다.');
            }

            const responseData = await response.json();

            localStorage.setItem('token', responseData.token);
            localStorage.setItem('username', formData.id);
            localStorage.setItem("isLoggedIn", "1");

            login();  // LoginContext의 login 함수를 호출하여 상태를 업데이트

            alert("로그인이 성공적으로 완료되었습니다!");
            navigate('/');
        } catch (error) {
            console.error('로그인 오류:', error);
            console.log("Form has errors. Please correct them before submitting.");
        }
    };

    return (
        <LoginPageBack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormWrapper>
                    <LoginPageTitle>로그인 페이지</LoginPageTitle>
                    
                    <InputPart
                        type="text"
                        placeholder="아이디"
                        {...register('id', {required: true})}
                    />
                    <LoginValidate>{errors.id && <p>아이디를 입력해주세요</p>}</LoginValidate>

                    <InputPart
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        {...register('password', {
                            required: true,
                            minLength: {
                                value: 4,
                                message: '비밀번호는 최소 4자리 이상이어야 합니다.',
                            },
                            maxLength: {
                                value: 12,
                                message: '비밀번호는 최대 12자리까지 가능합니다.',
                            },
                            validate: {
                                combination: value => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,12}$/.test(value) || '영어, 숫자, 특수문자를 모두 조합해서 비밀번호를 작성해야 합니다.',
                            },
                        })}
                    />
                    <LoginValidate>
                        {errors.password?.type === 'required' && (<p>비밀번호를 입력해주세요</p>)}
                        {errors.password?.message && (<p>{errors.password.message}</p>)}
                    </LoginValidate>

                    <LoginButton type="submit">로그인</LoginButton>
                </FormWrapper>
            </form>
        </LoginPageBack>
    );
}
