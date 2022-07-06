import { Component, OnInit } from '@angular/core';
// @ts-ignore
import {
  main_Linking,
  SetAtomSelect,
  generateMolSketcherGrowing, generateMolSketcherLinking
} from '../../../../Backend/MainJS.js';
import {MessageService} from "../message/message.service";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Undesired_substructures_DATA_BASE} from "../undesired-substructures";
import {UndesiredSubstructures} from "../undesired-substructures";
export interface Function {
  Position : string;
  Name: string;
  Name_Func:string;
  Bonds:string;
  //If there is more than one function with the same name this number will be 1 for the second occurence
  ID:number;

}
export interface Rule {
  checked:boolean;
  Id : number;
  Name: string;
  Image:string,

}

@Component({
  selector: 'app-linking',
  templateUrl: './linking.component.html',
  styleUrls: ['./linking.component.css']
})
export class LinkingComponent implements OnInit {
  Name1:string='frag_1';
  Name2:string='frag_2';
  smile1:string='';
  smile2:string='';
  Required_substructures:string='';
  Required_substructures1:string='';
  Required_substructures2:string='';

  //We could use FromGroup in this case too
  Detected_Functions:Function[]=[];
  Detected_Functions1:Function[]=[];
  Selected_Function1_name:string="";
  Selected_Function1!:Function;

  Detected_Functions2:Function[]=[];
  Selected_Function2_name:string="";
  Selected_Function2!:Function;


  Detected_Rules1:Rule[]=[];
  Detected_Rules2:Rule[]=[];
  Form_Rules1!:FormGroup;
  Form_Rules2!:FormGroup;
  Selected_Rules1:Rule[]=[];
  Selected_Rules2:Rule[]=[];

  Selected_Undesired_Substructures:UndesiredSubstructures[]=[];
  Undesired_Substructures:UndesiredSubstructures[]=[];
  Form_UndSub!:FormGroup;

  Rmode:string='default';
  BBD:string='standard';

  Check_All:boolean=false;

  constructor(private message : MessageService) {}
  ngOnInit(): void {
    this.Undesired_Substructures=Undesired_substructures_DATA_BASE;
    this.Form_Rules1=new FormGroup({
      rules: new FormArray([])});
    this.Form_Rules2=new FormGroup({
      rules: new FormArray([])});

    this.Form_UndSub=new FormGroup({
      UndSub: new FormArray([])});
    const formArray = this.Form_UndSub.get('UndSub') as FormArray;
    // loop each existing value options from database
    this.Undesired_Substructures.forEach(UndSub => {
      // generate control Group for each option and push to formArray
      formArray.push(new FormGroup({
        Name: new FormControl(UndSub.Name),
        Smart: new FormControl(UndSub.Smart),
        checked: new FormControl(false)

      }))
    })

    main_Linking();
  }
  //0 ypu want to show the reactions
  //1 you want to hide the reactions
  //anything else, if it's hide you show it, if it's not you hide it
  ShowReactions(Status:Number,num_skecth:number=0):void {
    let doc=document.getElementById("reac");
    let doc1;
    if(num_skecth==1){
      doc1=document.getElementById("FunctionsPart1");
    }
    else if (num_skecth==2){
      doc1=document.getElementById("FunctionsPart2");
    }
    let vThis=document.getElementById("Fleche1");
    let doc2=document.getElementById("RulesPart");
    let doc3=document.getElementById("FunctionsPart1");
    let doc4=document.getElementById("FunctionsPart2");
    let doc5=document.getElementById("Validate_Function");
    if(doc!=null && vThis!=null) {
      if (Status==0  && doc1!=null && doc2!=null && doc3!=null && doc4!=null && doc5!=null) {
        if (doc.style.display == "none") {
          vThis.className = "fas fa-caret-up";
          doc.style.display = "block";
        }
        if (doc1.style.display == "none") {
          doc1.style.display = "block";
        }
        if (doc2.style.display == "block") {
          doc2.style.display = "none";
        }
        if(doc3.style.display == "block" && doc4.style.display == "block"){
            doc5.style.display = "block";
        }
      }
      else if (Status==1) {
        if (doc.style.display == "block") {
          doc.style.display = "none";
          vThis.className = "fas fa-caret-down";
        }
      }
      else if (Status==2){
        if (doc.style.display == "none") {
          vThis.className = "fas fa-caret-up";
          doc.style.display = "block"
        }
        else{
          vThis.className = "fas fa-caret-down";
          doc.style.display = "none";
        }
      }
    }
    return;
  }
  //Show the Substructure part
  ShowSub(Status:Number):void {
    let doc=document.getElementById("sub");
    let vThis=document.getElementById("Fleche2");
    let doc1=document.getElementById("Undesired_sub");
    if (doc != null && vThis != null && doc1!=null) {

      if (Status==0) {
        if (doc.style.display == "none") {
          vThis.className = "fas fa-caret-up";
          doc.style.display = "block";
        }
        if (doc1.style.display == "none") {
          doc1.style.display = "block";
        }
      }
      else if (Status==1) {
        if (doc.style.display == "block") {
          doc.style.display = "none";
          vThis.className = "fas fa-caret-down";
        }
      }
      else {
        if (doc.style.display == "none") {
          vThis.className = "fas fa-caret-up";
          doc.style.display = "block";
        } else {
          doc.style.display = "none";
          vThis.className = "fas fa-caret-down";
        }
      }

    }
    return;
  }
  //Show the sett part
  ShowSett(Status:number):void {
    let doc=document.getElementById("sett");
    let vThis=document.getElementById("Fleche3");
    if (doc != null && vThis != null ) {
      if (Status==0) {
        if (doc.style.display == "none") {
          vThis.className = "fas fa-caret-up";
          doc.style.display = "block";
        }
      }
      else if (Status==1) {
        if (doc.style.display == "block") {
          doc.style.display = "none";
          vThis.className = "fas fa-caret-down";
        }
      }
      else {
        if (doc.style.display == "none") {
          vThis.className = "fas fa-caret-up";
          doc.style.display = "block";
        } else {
          doc.style.display = "none";
          vThis.className = "fas fa-caret-down";
        }
      }

    }
    return;
  }
  //Highlight on the sketcher
  Highlightfunction(num_sketch:Number,pos:string,bonds:string){
    SetAtomSelect(num_sketch,pos,bonds);
  }

  //GenerateMol button
  GenerateMol(nb_sketch:number) {
    if (nb_sketch == 1) {
      if (this.smile1 != '') {
        generateMolSketcherLinking(this.smile1,1);
      }
    } else {
      if (this.smile2 != '') {
        generateMolSketcherLinking(this.smile2,2);
      }
    }
  }
  //Launch the python Script
  LaunchPytonFindFunction() {
    this.Update_smile(1);
    let data;
      data = {
        smiles: this.smile1
      }
        this.message.sendMessage('Callscript_Func', data ).subscribe(res => {
          this.Detected_Functions = [];
          if (res.status == "error") {
            window.alert("There is an error in the structure 1");
          } else {
            console.log(res);
            if (res.data != null) {
              this.ConvertRestultFunction(res.data,1);
              this.Detected_Functions1 = this.Detected_Functions;
              this.Update_smile(2);
              data = {
                smiles: this.smile2
              }
              this.message.sendMessage('Callscript_Func', data).subscribe(res => {
                this.Detected_Functions = [];
                if (res.status == "error") {
                  window.alert("There is an error in the structure 2");
                } else {
                  console.log(res);
                  if (res.data != null) {

                    this.ConvertRestultFunction(res.data, 2);
                    this.Detected_Functions2 = this.Detected_Functions;

                  }
                  else {
                    window.alert("We could not find functions for your molecules, it may be that they are not yet available or there is an error in the molecules.");
                    this.Detected_Functions2 = this.Detected_Functions;
                    this.ShowReactions(1);
                  }
                }
                if (this.Detected_Functions1.length != 0 && this.Detected_Functions2.length != 0) {
                  this.ShowReactions(0, 1);
                  this.ShowReactions(0, 2);
                }
              });
            }
            else {
              window.alert("We could not find functions for your molecules, it may be that they are not yet available or there is an error in the molecules.");
              this.Detected_Functions1 = this.Detected_Functions;
              this.ShowReactions(1);
            }
          }
          console.log(this.Detected_Functions1);
          console.log(this.Detected_Functions2);


        });

    return;
  }
  //Convert the result from the python script for function
  ConvertRestultFunction(output:string [],nb_sketch:number){
    let name:string;
    let pos:number[]=[];
    let tmp:string="";
    let numb_tmp:number=0;
    let bond:string[] =[];
    let limit:number=0;
    let smile:string="";
    let cpt_Halide_alkyl=0;
    let cpt_Halide_aryl=0;
    let cpt_Halo_pyrimidine=0;
    if(nb_sketch==1){
      smile=this.smile1;
    }
    else{
      smile=this.smile2;
    }
    for(let i = 0; i < output.length; i++) {

      name=output[i];
      i+=1;
      let j = 0;
      let cpt=0;
      while (j<output[i].length) {
        tmp = "";
        pos = [];
        bond = [];
        let nametemp:string=name;
        if(nametemp=="Halide alkyl Cl" || nametemp=="Halide alkyl Br" || nametemp=="Halide alkyl I"){
          nametemp="Halide alkyl";
          //In case we detect one function more than on time
          if(cpt_Halide_alkyl!=0){
            nametemp+='_'+cpt_Halide_alkyl;
          }

        }
        else if(nametemp=="Halide aryl Cl" || nametemp=="Halide aryl Br" || nametemp=="Halide aryl I"){
          nametemp="Halide aryl";
          //In case we detect one function more than on time
          if(cpt_Halide_aryl!=0){
            nametemp+='_'+cpt_Halide_aryl;
          }

        }
        else if(nametemp=="Halo pyrimidine Cl" || nametemp=="Halo pyrimidine Br" || nametemp=="Halo pyrimidine I"){
          nametemp="Halo pyrimidine";
          //In case we detect one function more than on time
          if(cpt_Halo_pyrimidine!=0){
            nametemp+='_'+cpt_Halo_pyrimidine;
          }

        }
        else{
          //In case we detect one function more than on time
          if(cpt!=0){
            nametemp+='_'+cpt;
          }
        }

        //We search the first number
        while ((j<output[i].length)&& ((isNaN(+output[i][j])) ||(output[i][j] == " ") || (output[i][j] == ","))) {
          j++;
        }
        //Check if we are not at the end of the string
        if(j<output[i].length) {

          while ((+output[i][j] >= 0 && +output[i][j] <= 9) || output[i][j] == ",") {
            if (output[i][j] == "," || output[i][j] == " " ) {
              if (tmp != "") {
                limit=Number(tmp);
                numb_tmp=limit;
                //Move the index of the function in the case with explicit H
                let k=0
                while(k<=limit){
                  if (smile[k] == "H" || !this.isAlpha(smile[k]) ) {
                    limit = limit + 1;
                    if (smile[k] == "H") {
                      numb_tmp = numb_tmp + 1;

                    }
                  }
                  k++;
                }
                pos.push(numb_tmp + 1);

                tmp = "";
              }
            } else {
              tmp += output[i][j]
            }
            j++;
          }

          if (tmp != "") {
            limit=Number(tmp);
            numb_tmp=limit;
            //test
            let k=0
            while(k<=limit){
              if (smile[k] == "H" || !this.isAlpha(smile[k])) {
                limit = limit + 1;
                if (smile[k] == "H") {
                  numb_tmp = numb_tmp + 1;

                }
              }
              k++;
            }

            pos.push(numb_tmp + 1);
          }
          for (let k = 0; k < pos.length; k++) {
            for (let h = 0; h < pos.length; h++) {
              if (k != h) {
                bond.push(pos[k] + "-" + pos[h]);
              }
            }
          }
          cpt += 1;
          if(name=="Halide alkyl Cl" || name=="Halide alkyl Br" || name=="Halide alkyl I"){
            cpt_Halide_alkyl+=1;
          }
          else if(name=="Halide aryl Cl" || name=="Halide aryl Br" || name=="Halide aryl I") {
            cpt_Halide_aryl+=1
          }
          else if(name=="Halo pyrimidine Cl" || name=="Halo pyrimidine Br" || name=="Halo pyrimidine I") {
            cpt_Halo_pyrimidine+=1;
          }
          this.Detected_Functions.push({Name: nametemp, Position: pos.toString(),Name_Func:name, Bonds: bond.toString(),ID:cpt});
        }
      }
    }

  }
  //There is a problem with ngmodel so we get the smile from the textbox tu update the smile that we have in our typescript
  Update_smile(nb_sketch:number){
    let smildoc
    if(nb_sketch==1){
      smildoc=(<HTMLInputElement>document.getElementById("smilesMolecule1"));
      if(smildoc!=null){
        this.smile1=smildoc.value;
      }
    }
    else if(nb_sketch==2){
      smildoc=(<HTMLInputElement>document.getElementById("smilesMolecule2"));
      if(smildoc!=null){
        this.smile2=smildoc.value;
      }
    }
  else{
      console.log("Wrong numsketch")
      return;
    }
  }
  //When you ValidValidate your Molecule
  ValidateMol(){
    this.Update_smile(1);
    this.Update_smile(2);
    this.GenerateMol(1);
    this.GenerateMol(2);
    this.ShowSub(1)
    this.ShowSett(1)
    this.LaunchPytonFindFunction();
  }
  //When you validate which function is targeted
  //Attention ici on test avec juste le premier smile on s'occupera après du reste
  ValidateFunction(nb_sketch:number) {


    //Generate Reactions :
    if (this.Selected_Function1_name == "" || this.Selected_Function2_name == "") {
      window.alert("Please select a targeted function before generate reactions rules.");
    } else {

      let i = 0;
      let trouve = false;
      while (!trouve) {
        if (this.Detected_Functions1[i].Name == this.Selected_Function1_name) {
          this.Selected_Function1 = this.Detected_Functions1[i];
          trouve = true;
        }
        i++;

      }
      let data = {funcname: this.Selected_Function1.Name_Func}
      this.message.sendMessage('Callscript_rules', data).subscribe(res => {
        if (res.status == "error") {
        } else {
          let doc = document.getElementById("RulesPart");
          console.log(res);
          if (res.data != null) {
            this.ConvertRestultRules(res.data, 1);
            // get array control
            //
            this.Form_Rules1 = new FormGroup({
              rules: new FormArray([])
            });
            const formArray = this.Form_Rules1.get('rules') as FormArray;
            // loop each existing value options from database
            this.Detected_Rules1.forEach(rule => {
              // generate control Group for each option and push to formArray
              formArray.push(new FormGroup({
                name: new FormControl(rule.Name),
                Id: new FormControl(rule.Id),
                checked: new FormControl(rule.checked)

              }))
            })
            let i = 0;
            let trouve = false;
            while (!trouve) {
              if (this.Detected_Functions2[i].Name == this.Selected_Function2_name) {
                this.Selected_Function2 = this.Detected_Functions2[i];
                trouve = true;
              }
              i++;

            }
            let data = {funcname: this.Selected_Function2.Name_Func}
            this.message.sendMessage('Callscript_rules', data).subscribe(res => {
              if (res.status == "error") {
              } else {
                let doc = document.getElementById("RulesPart");
                console.log(res);
                if (res.data != null) {

                  if (doc != null) {
                    if (doc.style.display == "none") {
                      doc.style.display = "block";
                    }
                  }

                  this.ConvertRestultRules(res.data, 2);
                  // get array control
                  //
                  this.Form_Rules2 = new FormGroup({
                    rules: new FormArray([])
                  });
                  const formArray = this.Form_Rules2.get('rules') as FormArray;
                  // loop each existing value options from database
                  this.Detected_Rules2.forEach(rule => {
                    // generate control Group for each option and push to formArray
                    formArray.push(new FormGroup({
                      name: new FormControl(rule.Name),
                      Id: new FormControl(rule.Id),
                      checked: new FormControl(rule.checked)

                    }))
                  })

                } else {

                  this.Form_Rules2 = new FormGroup({
                    rules: new FormArray([])
                  });
                  const formArray = this.Form_Rules2.get('rules') as FormArray;
                  // loop each existing value options from database
                  this.Detected_Rules2.forEach(rule => {
                    // generate control Group for each option and push to formArray
                    formArray.push(new FormGroup({
                      name: new FormControl(rule.Name),
                      Id: new FormControl(rule.Id),
                      checked: new FormControl(rule.checked)

                    }))
                  })
                  window.alert("We could not find any rule corresponding to the selected function")
                  //Attention ici il faudra peut être changer
                  if (doc != null) {
                    if (doc.style.display == "block") {
                      doc.style.display = "none";
                    }
                  }
                  this.ShowSub(1);
                }
                //Generate required Substructure
                this.GenerateSub();
              }
            });
          } else {
            this.Form_Rules1 = new FormGroup({
              rules: new FormArray([])
            });
            const formArray = this.Form_Rules1.get('rules') as FormArray;
            // loop each existing value options from database
            this.Detected_Rules1.forEach(rule => {
              // generate control Group for each option and push to formArray
              formArray.push(new FormGroup({
                name: new FormControl(rule.Name),
                Id: new FormControl(rule.Id),
                checked: new FormControl(rule.checked)

              }))
            })
            window.alert("We could not find any rule corresponding to the selected function");
            //Attention ici il faudra peut être changer
            if (doc != null) {
              if (doc.style.display == "block") {
                doc.style.display = "none";
              }
            }
            this.ShowSub(1);
          }
          //Generate required Substructure
          this.GenerateSub();
        }
      });
    }
  }
  ConvertRestultRules(output:string [],numb_func:number){
    let name:string="";
    let id:number;
    let tmp:string="";
    let Detected_Rules=[];
    if(numb_func==1){
      this.Detected_Rules1=[];
    }
    else if(numb_func==2){
      this.Detected_Rules2=[];
    }
    for(let i = 0; i < output.length; i++) {
      let j = 0;
      name = "";
      tmp="";
      while ((+output[i][j] >= 0 && +output[i][j] <= 9)) {
        tmp += output[i][j]
        j++;
      }
      id=Number(tmp);
      while(output[i][j]==" " || output[i][j]==":"){
        j++;
      }
      while(j<output[i].length){
        name+=output[i][j];
        j++;
      }
      let trouve=false;
      let h=0;
      while(!trouve && h<Detected_Rules.length){
        if(Detected_Rules[h].Name==name){
          trouve=true;
        }
        h++;
      }
      if(!trouve){
        Detected_Rules.push({checked:false,Id: id,Name:name,Image:"assets/Images_Rules/Rules"+id+".png"});
      }
    }
    if(numb_func==1){
     this.Detected_Rules1=this.Detected_Rules1.concat(Detected_Rules);
    }
    else if(numb_func==2){
      this.Detected_Rules2=this.Detected_Rules2.concat(Detected_Rules);
    }

  }
  GenerateSub(){
    let data1 = {
      smiles : this.smile1,
      funcname:this.Selected_Function1.Name_Func
    };
    this.message.sendMessage('Callscript_Sub', data1).subscribe(res => {
      if (res.status == "error") {
      } else {
        console.log(res);
        if (res.data != null) {
          //this.Required_substructures=res.data[0];

          this.Remove_Sub(res.data,1);

        }
      }
    });
    let data2 = {
      smiles : this.smile2,
      funcname:this.Selected_Function2.Name_Func
    };
    this.message.sendMessage('Callscript_Sub', data2).subscribe(res => {
      if (res.status == "error") {
      } else {
        console.log(res);
        if (res.data != null) {
          this.Remove_Sub(res.data,2);

        }
      }
    });
  }
  ValidateReactions(){
    this.Selected_Rules1=this.Form_Rules1.value.rules.filter((f: { checked: any; }) => f.checked);
    console.log(this.Selected_Rules1);
    this.Selected_Rules2=this.Form_Rules2.value.rules.filter((f: { checked: any; }) => f.checked);
    console.log(this.Selected_Rules2);
    if((this.Selected_Rules1.length==0)||(this.Selected_Rules2.length==0) ){
      window.alert("Please choose at least one reaction rule for each functions.");
    }
    else{
      this.ShowSub(0);
    }

  }
  //For the HTML
  get FormRules1() { return <FormArray>this.Form_Rules1.get('rules'); }
  get FormRules2() { return <FormArray>this.Form_Rules2.get('rules'); }
  get FormUndSub() { return <FormArray>this.Form_UndSub.get('UndSub'); }

  ValidateUndSub() {
    this.Selected_Undesired_Substructures=this.Form_UndSub.value.UndSub.filter((f: { checked: any; }) => f.checked);
    console.log(this.Selected_Undesired_Substructures);
    this.ShowSett(0);

  }
  isAlpha(str:string) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };
  //Remove the substurcture
  //More information in the same function in growing.component.ts
  Remove_Sub(res:string [],nb_func:number){
    let i=0;
    let nb_remove=1;
    let nb_removed=0;
    let smiles_with_H=res[0]
    let tmp="";
    let numb_tmp:number=0;
    let nb_tmp2:number;
    let num_tmp_atom:number;
    let required_sub_tmp2=""
    let remove=res[2];
    let j=0;
    let found:boolean=false
    let To_remove="";
    this.Required_substructures='';
    let min=100;
    let id=1;
    //Usefull for the / in case if there is the same atom not in the function but in the range of the pos of the function
    let posi=[];
    let num_atom=1;
    let Id_func=0;
    //Go to the begining of the pos of the targeted function in the smile
    if(nb_func==1){
      Id_func=this.Selected_Function1.ID ;
    }
    else{
      Id_func=this.Selected_Function2.ID ;
    }
    while (id<Id_func &&(j<res[1].length)) {
      if ((res[1][j] == ")")) {
        id++;
      }
      j++
    }
    while ( (j<res[1].length)&&((isNaN(+res[1][j])) || (res[1][j] == " ") || (res[1][j] == ","))) {
      j++;
    }
    //Check if we are not at the end of the string
    //Search the min of the pos of the targeted function
    if(j<res[1].length) {
      while (res[1][j] != ")") {
        tmp = "";
        while ((+res[1][j] >= 0 && +res[1][j] <= 9)) {
          tmp += res[1][j];
          j++;
        }
        //Because we will skip it if we have a number and juste a ) after
        if(res[1][j] != ")") {
          j++;
        }
        numb_tmp = Number(tmp) + 1;
        if (numb_tmp != 1){
          posi.push(numb_tmp);
        }
        if(numb_tmp<min && numb_tmp!=1){
          min=numb_tmp;
        }
      }


    }
    numb_tmp=min;
    let k=0;
    //Find the position of the targeted function in the smiles
    while(k<numb_tmp && numb_tmp!=2 && numb_tmp<smiles_with_H.length){
      if (!this.isAlpha(smiles_with_H[k])|| (+smiles_with_H[k] >= 0 && +smiles_with_H[k]<= 9) ||((smiles_with_H[k]=="C" && smiles_with_H[k+1]=="l" ) || (smiles_with_H[k]=="B" && smiles_with_H[k+1]=="r" )) ) {
        numb_tmp=numb_tmp + 1;

      }
      if (this.isAlpha(smiles_with_H[k]) && smiles_with_H[k]!="l" && smiles_with_H[k+1]!="r" ){
        num_atom+=1;
      }
      this.Required_substructures+=smiles_with_H[k];
      k++;
    }
    //If it's the first atom we don't want to loose the first character of the smile
    if(numb_tmp==2){
      numb_tmp=0;
    }
    i=0;


    let nb_open_parenthesis=0;
    let nb_close_parenthesis=0;
    nb_tmp2=numb_tmp;
    num_tmp_atom=num_atom;
    required_sub_tmp2=this.Required_substructures
    while(remove!=undefined && i<remove.length){
      nb_remove=1;
      found=false
      To_remove="";
      while((i<remove.length) &&((+remove[i] >= 0 && +remove[i]<= 9)||(!this.isAlpha(remove[i]) ||(remove[i]=="R")) && remove[i]!="#" && remove[i]!="/")) {
        if (+remove[i] >= 0 && +remove[i] <= 9) {
          nb_remove = Number(remove[i]);
          i++;
        }
        else{
          i++;
        }
      }
      //Special character, go to the next occurrence of the character after this one, without remove it from the required substructure
      while(remove[i]=="/"){
        i++;
        //If we want to remove an H in the first position of the smile, we don't move
        while((numb_tmp < smiles_with_H.length && (smiles_with_H[numb_tmp] !=remove[i]|| (posi.indexOf(num_atom)<0)) && (numb_tmp!=0 || remove[i+1]!="H"))   ){
          this.Required_substructures+=smiles_with_H[numb_tmp];
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          numb_tmp++;
        }
        //We go after the atom we wanted to go
        if(numb_tmp < smiles_with_H.length && (numb_tmp!=0 || remove[i+1]!="H" ) && this.isAlpha(remove[i])) {
          this.Required_substructures += smiles_with_H[numb_tmp];
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          numb_tmp++;
        }
        i++;
      }



      //If we have a Br or Cl to remove
      if((remove[i]=="C" && remove[i+1]=="l")||(remove[i]=="B" && remove[i+1]=="r")|| (remove[i]=="C" && remove[i+1]=="l")){
        To_remove=remove[i];
        i++;
        To_remove+=remove[i];
        //while we are not near the atom that we want to remove we add the smiles to the required sub
        while ((numb_tmp < smiles_with_H.length - 2)&&(smiles_with_H[numb_tmp] != To_remove[0] && smiles_with_H[numb_tmp + 1] != To_remove[1]) && (smiles_with_H[numb_tmp + 1] != To_remove[0] && smiles_with_H[numb_tmp + 2] != To_remove[1]) ) {
          this.Required_substructures += smiles_with_H[numb_tmp];
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          numb_tmp++;

        }
        //Check if we are at the atom that we want to remove
        if ((smiles_with_H[numb_tmp] == To_remove[0] && smiles_with_H[numb_tmp + 1] == To_remove[1]) && (posi.indexOf(num_atom) > -1)) {
          found = true
        }
        //Check if there is a character between our position and then the atom that we want to remove because if this is a parenthesis we will want to remove it
        else if (((smiles_with_H[numb_tmp + 1] == To_remove[0]) && (smiles_with_H[numb_tmp + 2] == To_remove[1]) && (posi.indexOf(num_atom) > -1))) {
          found = true
          //If there is a parenthesis we add one to the nb_open_parenthesis and we skip this parenthesis
          if (smiles_with_H[numb_tmp] == "(") {
            nb_open_parenthesis += 1;

          }
          //Else this is a number or an atom so we want to keep it
          else{
            this.Required_substructures+=smiles_with_H[numb_tmp];
          }
          numb_tmp++;
        }

        nb_removed = 0;
        //While we haven't remove the atom or the number of this atom that we want to remove we don't add the character to the required_substructure, and close as mush parenthesis as we have open in this while loop
        while (found &&(numb_tmp < smiles_with_H.length) && (((nb_removed < nb_remove) || (((!this.isAlpha(smiles_with_H[numb_tmp]))&& (smiles_with_H[numb_tmp] != "[") && (smiles_with_H[numb_tmp] != "(") &&((smiles_with_H[numb_tmp] != ")")||(nb_close_parenthesis<nb_open_parenthesis))))))){
          //If we are removing what we want to remove
          if ((smiles_with_H[numb_tmp]==To_remove[0])&&(smiles_with_H[numb_tmp+1]==To_remove[1])) {
            nb_removed++;
            num_atom+=1;
            numb_tmp++;
          }
          if(smiles_with_H[numb_tmp]=="("){
            nb_open_parenthesis+=1;
          }
          else if(nb_open_parenthesis>0 &&smiles_with_H[numb_tmp]==")"){
            nb_close_parenthesis+=1;
          }
          //If there is a letter and it's not the l or the r of Cl or Br we add 1 to the number of atoms that we have already read in the smiles
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          numb_tmp++;

        }
        //If we haven't found what we want to remove we go back to the position before we tried to remove
        //Else we save the position, it's the new checkpoint
        if(!found){
          numb_tmp=nb_tmp2;
          num_atom=num_tmp_atom;
          this.Required_substructures=required_sub_tmp2;
        }
        else{
          nb_tmp2=numb_tmp;
          num_tmp_atom=num_atom;
          required_sub_tmp2=this.Required_substructures;

        }
      }
      else {
        //while we are not near the atom that we want to remove we add the smiles to the required sub distance of 2 because if there is "([" for example we want to remove it
        while (smiles_with_H[numb_tmp] != remove[i] && smiles_with_H[numb_tmp + 1] != remove[i] && smiles_with_H[numb_tmp + 2] != remove[i] && numb_tmp < smiles_with_H.length - 2) {
          this.Required_substructures += smiles_with_H[numb_tmp];
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          numb_tmp++;

        }
        //If we have found what we want to remove
        if (smiles_with_H[numb_tmp] == remove[i] || smiles_with_H[numb_tmp + 1] == remove[i] || smiles_with_H[numb_tmp + 2] == remove[i]) {
          found = true
        }

        //We want to add any atoms or number between our position and the position of the atom that we want to remove
        while(found && (smiles_with_H[numb_tmp]!=remove[i] && (this.isAlpha(smiles_with_H[numb_tmp]) || (+smiles_with_H[numb_tmp] >= 0 && +smiles_with_H[numb_tmp]<= 9) || smiles_with_H[numb_tmp] == "]" || smiles_with_H[numb_tmp] == ")"))){
          this.Required_substructures+=smiles_with_H[numb_tmp];
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          numb_tmp++;
        }
        nb_removed = 0;
        //While we haven't remove the atom or the number of this atom that we want to remove we don't add the character to the required_substructure, and close as mush parenthesis as we have open in this while loop
        while (found &&(numb_tmp < smiles_with_H.length) && (((nb_removed < nb_remove) || (((!this.isAlpha(smiles_with_H[numb_tmp]))||(smiles_with_H[numb_tmp] == "H")) && (smiles_with_H[numb_tmp] != "[") && (smiles_with_H[numb_tmp] != "(") &&((smiles_with_H[numb_tmp] != ")")||(nb_close_parenthesis<nb_open_parenthesis)))))) {
          if (this.isAlpha(smiles_with_H[numb_tmp]) && smiles_with_H[numb_tmp]!="l" && smiles_with_H[numb_tmp]!="r" ){
            num_atom+=1;
          }
          if (smiles_with_H[numb_tmp] == remove[i]) {
            nb_removed++;
          }
          if(smiles_with_H[numb_tmp]=="("){
            nb_open_parenthesis+=1;
          }
          else if(nb_open_parenthesis>0 && smiles_with_H[numb_tmp]==")"){
            nb_close_parenthesis+=1;
          }
          numb_tmp++;

        }
        //If we haven't found what we want to remove we go back to the position before we tried to remove
        if(!found){
          numb_tmp=nb_tmp2;
          num_atom=num_tmp_atom;
          this.Required_substructures=required_sub_tmp2;
        }
        else{
          nb_tmp2=numb_tmp;
          num_tmp_atom=num_atom;
          required_sub_tmp2=this.Required_substructures;
        }
      }


      i++;
    }
    for(numb_tmp;numb_tmp<smiles_with_H.length;numb_tmp++){
      this.Required_substructures+=smiles_with_H[numb_tmp];
    }
    console.log(this.Required_substructures);

    if(nb_func==1){
      this.Required_substructures1=this.Required_substructures;
    }
    else{
      this.Required_substructures2=this.Required_substructures;
    }
  }
  Send_To_Galaxy(){
    let regex = /^[a-zA-Z0-9\-_]+[a-zA-Z0-9\-_]*$/;
    if(!regex.test(this.Name1) || !regex.test(this.Name2)){
      window.alert("The name of the fragment (s) is (are) not valid, only alphanumeric characters, '-' and '_' are allowed")
    }
    else {
      let data = {
        Name1: this.Name1,
        Smile1: this.smile1,
        Rules1: this.Selected_Rules1,
        Required_Sub1: this.Required_substructures1,
        Name2: this.Name2,
        Smile2: this.smile2,
        Rules2: this.Selected_Rules2,
        Required_Sub2: this.Required_substructures2,

        Undesired_Sub: this.Selected_Undesired_Substructures,
        Rmode: this.Rmode,
        BBD: this.BBD,
      }
      console.log(data);
    }
  }
  LaunchDemo(){
    this.smile1="CC(C)N1CCC(N)CC1";
    this.Name1="piperidine";
    this.GenerateMol(1);
    this.smile2="OC(=O)c1ccc(Cl)s1";
    this.Name2 = "thiophene";
    this.GenerateMol(2);
    this.delay(200).then(any=>{
      this.ValidateMol();
    });

  }
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }
  Check_Name(event:any){
    let regex = /^[a-zA-Z0-9\-_]+[a-zA-Z0-9\-_]*$/;
    if(!regex.test(event.target.value))
    {
      this.surligne(event.target, true);
      return false;
    }
    else
    { this.surligne(event.target, false);
      return true;
    }

  }
  //Check or uncheck all value in undesired substructures
  checkUncheckAll() {
    this.FormUndSub.controls.map(checked=>{
      checked.patchValue({checked:this.Check_All});
    });
  }

  surligne(input:HTMLInputElement, error:any)//change de couleur selon la conformité de ce qui est rentré
  {
    if(error){
      input.style.borderColor = "#D10C13";
    }
    else{
      input.style.borderColor = "#04DC13";
    }
  }

}
