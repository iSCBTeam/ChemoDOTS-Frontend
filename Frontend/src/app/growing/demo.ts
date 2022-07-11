LaunchDemo(){
    this.smile="Cc1ccc(N)cc1Nc1nccc(n1)-c1cccnc1";
    this.Name="imatinib-frag";
    this.GenerateMol();
    this.delay(200).then(any=>{
      this.ValidateMol();
    });
}
ResetDemo(){
    this.smile=" ";
    this.Name="";
    this.GenerateMol();
}

