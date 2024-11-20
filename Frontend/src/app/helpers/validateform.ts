import { FormGroup,FormControl } from "@angular/forms";

export default class ValidateForm{
    static validateAllFormFields(formgroup:FormGroup){
        Object.keys(formgroup.controls).forEach(field=>{
          const control= formgroup.get(field);
          if(control instanceof FormControl){
            control.markAsDirty({onlySelf:true})
          }
          else if(control instanceof FormGroup){
            this.validateAllFormFields(control)
          }
        })
      }
}