import { Component, OnInit } from '@angular/core';
// @ts-ignore
import {main_Growing,SetAtomSelect,generateMolSketcherGrowing} from '../../../../Backend/MainJS.js';
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
  selector: 'app-growing',
  templateUrl: './growing.component.html',
  styleUrls: ['./growing.component.css']
})

export class GrowingComponent implements OnInit {
  smile:string='';
  Required_substructures:string='';

  Detected_Functions:Function[]=[];
  Selected_Function_name:string="";
  Selected_Function!:Function;


  Detected_Rules:Rule[]=[];
  Form_Rules!:FormGroup;
  Selected_Rules:Rule[]=[];

  Selected_Undesired_Substructures:UndesiredSubstructures[]=[];
  Undesired_Substructures:UndesiredSubstructures[]=[];
  Form_UndSub!:FormGroup;

  Name:string='frag';

  Rmode:string='default';
  BBD:string='standard';

  Check_All:boolean=false;


  constructor(private message : MessageService) {}
  //Do something when all the page have been launched
  ngOnInit(): void {
    this.Undesired_Substructures=Undesired_substructures_DATA_BASE;
    this.Form_Rules=new FormGroup({
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


    //Lauch the sketcher
    main_Growing();
  }


  //0 ypu want to show the reactions
  //1 you want to hide the reactions
  //anything else, if it's hide you show it, if it's not you hide it
  ShowReactions(Status:Number):void {
    let doc=document.getElementById("reac");
    let doc1=document.getElementById("FunctionsPart");
    let vThis=document.getElementById("Fleche1");
    let doc2=document.getElementById("RulesPart");
    if(doc!=null && vThis!=null && doc1!=null && doc2!=null) {
      if (Status==0) {
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
      }
      else if (Status==1) {
          if (doc.style.display == "block") {
            doc.style.display = "none";
            vThis.className = "fas fa-caret-down";
          }
        }
        else{
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
  //Work like show reaction
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
  //Work like showreaction
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
  GenerateMol() {
    if(this.smile!='') {
      generateMolSketcherGrowing(this.smile);
    }
  }



  //Launch the python Script
  LaunchPytonFindFunction() {
    this.Update_smile();
    let data = {
      smiles : this.smile
    }

    if(this.Detected_Functions.length==0){
      this.message.sendMessage('Callscript_Func', data ).subscribe(res => {
        if (res.status == "error") {
          window.alert("There is an error in the molecule");
        } else {
          console.log(res);
          if (res.data != null) {
            this.Detected_Functions=[];
            this.ConvertRestultFunction(res.data);
            this.ShowReactions(0);
          } else {
            window.alert("We could not find functions for your molecule, they may not be available yet or there is an error in the molecule.");
            }
          }
      });
    }
      return;
  }



  //Convert the result from the python script for function
  ConvertRestultFunction(output:string []){
    let name:string;
    let pos:number[]=[];
    let tmp:string="";
    let numb_tmp:number=0;
    let bond:string[] =[];
    let limit:number=0;
    let cpt_Halide_alkyl=0;
    let cpt_Halide_aryl=0;
    let cpt_Halo_pyrimidine=0;
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
                  if (this.smile[k] == "H" || !this.isAlpha(this.smile[k]) ) {
                    limit = limit + 1;
                    if (this.smile[k] == "H") {
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
            let k=0
            while(k<=limit){
              if (this.smile[k] == "H" || !this.isAlpha(this.smile[k])) {
                limit = limit + 1;
                if (this.smile[k] == "H") {
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



  //We have to update the smile because if marvin change the smile in the textbox, it will not change it in out typescript.
  Update_smile(){
    let smildoc =(<HTMLInputElement>document.getElementById("smilesMolecule"));
    if(smildoc!=null){
      this.smile=smildoc.value;
    }
  }



  //When you Validate your Molecule
  ValidateMol() {
    this.Update_smile();
    this.GenerateMol();
    this.ShowSub(1)
    this.ShowSett(1)
    this.Detected_Functions = [];
    this.LaunchPytonFindFunction();
  }



  //When you validate which function is targeted
  ValidateFunction() {
    this.ShowSub(1);
    //Generate Reactions :
    if(this.Selected_Function_name==""){
      window.alert("Please select a targeted function before generate reactions rules.");
    }
      else {
        let i=0;
        let trouve=false;
        while(!trouve){
          if(this.Detected_Functions[i].Name==this.Selected_Function_name){
            this.Selected_Function=this.Detected_Functions[i];
            trouve=true;
          }
          i++;

        }

          //Args for python script are in data
          let data = {funcname: this.Selected_Function.Name_Func}
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

                this.ConvertRestultRules(res.data);
                // get array control
                //
                this.Form_Rules = new FormGroup({
                  rules: new FormArray([])
                });
                const formArray = this.Form_Rules.get('rules') as FormArray;
                // loop each existing value options from database
                this.Detected_Rules.forEach(rule => {
                  // generate control Group for each option and push to formArray
                  formArray.push(new FormGroup({
                    name: new FormControl(rule.Name),
                    Id: new FormControl(rule.Id),
                    checked: new FormControl(rule.checked)

                  }))
                })

              } else {
                this.Detected_Rules = [];
                this.Form_Rules = new FormGroup({
                  rules: new FormArray([])
                });
                const formArray = this.Form_Rules.get('rules') as FormArray;
                // loop each existing value options from database
                this.Detected_Rules.forEach(rule => {
                  // generate control Group for each option and push to formArray
                  formArray.push(new FormGroup({
                    name: new FormControl(rule.Name),
                    Id: new FormControl(rule.Id),
                    checked: new FormControl(rule.checked)

                  }))
                })
                window.alert("We could not find any rule corresponding to the selected function")
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



  //Take the result of the python script and generate the rules that we will show on the site
  ConvertRestultRules(output:string []){
    let name:string="";
    let id:number;
    let tmp:string="";
    this.Detected_Rules = [];
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
          while(!trouve && h<this.Detected_Rules.length){
            if(this.Detected_Rules[h].Name==name){
              trouve=true;
            }
            h++;
          }
          if(!trouve){
            this.Detected_Rules.push({checked:false,Id: id,Name:name,Image:"assets/Images_Rules/Rules"+id+".png"});
          }

    }

  }




  //Launch the python script that will return what we have to remove to the smile to get the required substructure
    GenerateSub(){
      let data = {
        smiles : this.smile,
        funcname:this.Selected_Function.Name_Func
      };
        this.message.sendMessage('Callscript_Sub', data).subscribe(res => {
          if (res.status == "error") {
          } else {
            console.log(res);
            if (res.data != null) {

              this.Remove_Sub(res.data);

            }
          }
        });
      }



      //When you validate the choice of the reaction
    ValidateReactions(){
      //Keep only checked value
      this.Selected_Rules=this.Form_Rules.value.rules.filter((f: { checked: any; }) => f.checked);
      console.log(this.Selected_Rules);
      if(this.Selected_Rules.length==0 && this.Detected_Rules.length!=0){
        window.alert("Please choose at least one reaction rule.");
      }
      else{
        this.ShowSub(0);

      }

    }


    //For the HTML
  get FormRules() { return <FormArray>this.Form_Rules.get('rules'); }
  get FormUndSub() { return <FormArray>this.Form_UndSub.get('UndSub'); }


  //When you have selected your undesired substructure
  ValidateUndSub() {
    this.Selected_Undesired_Substructures=this.Form_UndSub.value.UndSub.filter((f: { checked: any; }) => f.checked);
    console.log(this.Selected_Undesired_Substructures);
    this.ShowSett(0);

  }



  //Check if str contain only alphabetic character
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



//Remove the substructure to generate the required substructure
  Remove_Sub(res:string []){
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
    this.Required_substructures="";
    let min=100;
    let id=1;
    //Usefull for the / in case if there is the same atom not in the function but in the range of the pos of the function
    let posi=[];
    // Save the position of the current atom, change when we move in the smile and we meet an atom
    let num_atom=1;
    //Go to the begining of the pos of the targeted function in the smile
    while (id<this.Selected_Function.ID &&(j<res[1].length)) {
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
        //If it's equal to 1 so Number(tmp)=0 so it was not a number
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
    //We add the end of the smiles to the required_sub
    for(numb_tmp;numb_tmp<smiles_with_H.length;numb_tmp++){
      this.Required_substructures+=smiles_with_H[numb_tmp];
    }
    console.log(this.Required_substructures);


  }



  //Create a Json object with all the value of the form
  Send_To_Galaxy(){
    let regex = /^[a-zA-Z0-9\-_]+[a-zA-Z0-9\-_]*$/;
    if(!regex.test(this.Name)){
      window.alert("The Fragment Name is invalid, only alphanumeric characters, '-' and '_' are allowed")
    }
    else{
    let data={
      Name:this.Name,
      Smile:this.smile,
      Rules:this.Selected_Rules,
      Required_Sub:this.Required_substructures,
      Undesired_Sub:this.Selected_Undesired_Substructures,
      Rmode:this.Rmode,
      BBD:this.BBD,
    }
    console.log(data);
    }
  }


  //Check if the name is valid, use (blur) in the html
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

  checkUncheckAll() {
    this.FormUndSub.controls.map(checked=>{
      checked.patchValue({checked:this.Check_All});
    });
  }



  //Highlight in red or green the input of the name
  surligne(input:HTMLInputElement, error:any)
  {
    if(error){
      input.style.borderColor = "#D10C13";
    }
    else{
      input.style.borderColor = "#04DC13";
    }
  }
}
