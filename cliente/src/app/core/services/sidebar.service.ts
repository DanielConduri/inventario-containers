import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  width!: number;
  height!: number;

  expand!: boolean;

  setSizeT(): number{
      return this.width = 1053
      
    // console.log(this.width);
  }

  setSizeF(): number{
    return this.width = 1250
  }

  getBool(exp : boolean): number{
    this.expand = exp
      if(this.expand === true){
        return this.setSizeT()
      }
      else{
        return this.setSizeF()
      }


    
  }

  // getFull(): boolean{
  //   let full = this.getBool(this.expand)
  //   // console.log(full);
  //   return full
  // }

  // getWithd(): number{
  //   if(this.getFull() === true){
  //     // console.log(this.setSizeT());
  //     return this.setSizeT()
  //   }
  //   else{
  //     // console.log(this.setSizeF());
  //     return this.setSizeF()
  //   }
  // }

}
