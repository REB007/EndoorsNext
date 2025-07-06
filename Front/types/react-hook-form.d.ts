declare module 'react-hook-form' {
  import * as React from 'react';

  export type FieldValues = Record<string, any>;
  
  export type FieldPath<TFieldValues extends FieldValues> = string;
  
  export interface UseFormReturn<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues extends FieldValues = TFieldValues
  > {
    control: Control<TFieldValues, TContext>;
    formState: FormState<TFieldValues>;
    getFieldState: (name: FieldPath<TFieldValues>, formState?: FormState<TFieldValues>) => FieldState;
    [key: string]: any;
  }
  
  export interface FormState<TFieldValues extends FieldValues = FieldValues> {
    errors: Record<string, any>;
    [key: string]: any;
  }
  
  export interface FieldState {
    error?: any;
    [key: string]: any;
  }
  
  export interface Control<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any
  > {
    [key: string]: any;
  }
  
  export interface ControllerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  > {
    name: TName;
    control?: Control<TFieldValues>;
    [key: string]: any;
  }
  
  export interface ControllerRenderProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  > {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: any;
    name: TName;
    [key: string]: any;
  }
  
  export const Controller: React.FC<ControllerProps>;
  export const FormProvider: React.FC<any>;
  export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): UseFormReturn<TFieldValues>;
  export function useForm<TFieldValues extends FieldValues = FieldValues>(): UseFormReturn<TFieldValues>;
}
