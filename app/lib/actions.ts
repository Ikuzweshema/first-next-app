'use server';
 import {z} from "zod"
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";

export type State={
    errors?:{
        customerId?:string[]
        amount?:string[]
        status?:string[]
    }
    message?: string|null
}
const formSchema=z.object({
  id:z.string(),
  customerId: z.string({
      invalid_type_error:" Please select a customer"
  }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status:z.enum(["pending","paid"],{
      invalid_type_error:"please select invoice status"
  }),
  date:z.string()
})

const CreateInvoice=formSchema.omit({id: true,date:true})
const UpdateInvoice=formSchema.omit({id:true,date: true})
export async function createInvoice(prevState:State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        await sql `  INSERT INTO invoices(customer_id,amount,status,date)
    VALUES (${customerId},${amountInCents},${status},${date})`
    }
    catch (e) {
        return
        message: "Failed to insert user"
    }


 revalidatePath("/dashboard/invoices")
  redirect("/dashboard/invoices")
}
export async function updateInvoice(prevState:State, id:string,formdata:FormData){
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formdata.get('customerId'),
        amount: formdata.get('amount'),
        status: formdata.get('status'),
    });
    if (!validatedFields.success){
        return{
            errors:validatedFields.error.flatten().fieldErrors,
            message:"Failed to update invoice missing fields"
        }
    }
    const {customerId,amount,status}=validatedFields.data
    const amountInCents=amount *100
    try {
        await sql`UPDATE invoices
                  SET customer_id=${customerId},
                      amount=${amountInCents},
                      status=${status}
                  where id = ${id}`
        revalidatePath("/dashboard/invoices")
        redirect("/dashboard/invoices")
    }
    catch (e) {
            return
            message: "Failed to Update user"
        }
}
export async function deleteInvoice(id:string){
    try {
        await sql `DELETE FROM invoices WHERE id=${id}`
        revalidatePath("/dashboard/invoices")
    }
    catch (e) {
        return
        message: 'Failed to delete user'
    }
}
export async function authenticate(prevState:string|undefined,formaData:FormData){
  try {
      await signIn("credentials",formaData)

  }
  catch (e) {
      if (e instanceof AuthError ) {
          switch (e.type) {
              case "CredentialsSignin":
                  return "Invalid Credentials"
              default:
                  return "something went wrong"

          }
      }
      throw e
  }
}