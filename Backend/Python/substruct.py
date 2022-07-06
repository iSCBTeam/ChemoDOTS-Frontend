#Dictionnary which associates functions name with their smarts
#substruct returns the smiles of the molecule without the function given in the parameters --> removes the fct


from Search_Function import *
import sys




functions ={}
#What we have to remove from the smile to generate the required substructure
remove={}

functions["Boronate alkyl"]='OB(O)C'
remove["Boronate alkyl"]='HOBOH'

functions["Boronate aryl"]='OB(O)c'
remove["Boronate aryl"]='HOBOH'

functions["Amine primaire alkyl"]='C[NH2]'
remove["Amine primaire alkyl"]='/NH'

functions["Amine secondaire alkyl"]='C[NH]C'
remove["Amine secondaire alkyl"]='/NH'

functions["Amine primaire aryl"]='c[NH2]'
#/ means you want to go to the next atom here N without remove it, Here we will go to the N atom and remove the H after this atom
remove["Amine primaire aryl"]='/NH'

functions["Amine secondaire aryl"]='c[NH]c'
remove["Amine secondaire aryl"]='/NH'

functions["Amine tertiaire"]='cN(C)C'
remove["Amine tertiaire"]='cN(C)C'

functions["Nitrile alkyl"]='CC#N'
remove["Nitrile alkyl"]='#N'

functions["Nitrile aryl"]='cC#N'
remove["Nitrile aryl"]='#N'
   
functions["Aziridine alkyl"]='C1NC1C'
remove["Aziridine alkyl"]='/NH'
    
functions["Aziridine aryl"]='C1NC1c'
remove["Aziridine aryl"]='/NH'
  
functions["Imine alkyl"]='[C;R0](=N)C'
remove["Imine alkyl"]='/NH'
   
functions["Imine aryl"]='[C;R0](=N)c'
remove["Imine aryl"]='/NH'
  
functions["Azide alkyl"]='[N-]=[N+]=NC'
remove["Azide alkyl"]='3N'
   
functions["Azide aryl"]='[N-]=[N+]=Nc'
remove["Azide aryl"]='3N'
   
functions["Amidine alkyl"]='C[C;R0](N)=N'
remove["Amidine alkyl"]='/NH/NH'

functions["Amidine aryl"]='c[C;R0](N)=N'
remove["Amidine aryl"]='/NH/NH'
   
functions["Hydrazine alkyl"]='C[NH;R0][NH2;R0]'
remove["Hydrazine alkyl"]='/NH/NHH'
    
functions["Hydrazine aryl"]='c[NH;R0][NH2;R0]'
remove["Hydrazine aryl"]='/NH/NHH'
    
functions["Alcool"]='[OH;R0][#6;!$([#6]=[O,S])]'
remove["Alcool"]='/OH'
    
functions["Alcohol Alkyl"]='C[OH]'
remove["Alcohol Alkyl"]='/OH'
  
functions["Alcohol Aryl"]='c[OH]'
remove["Alcohol Aryl"]='/OH'
    
functions["Acide alkyl"]='C[C;R0]([OH])=O'
remove["Acide alkyl"]='/OH'
    
functions["Acide aryl"]='c[C;R0]([OH])=O'
remove["Acide aryl"]='/OH'
    
functions["Aldehyde alkyl"]='C[CH1;R0](=O)'
remove["Aldehyde alkyl"]='=O'
   
functions["Aldehyde aryl"]='c[CH1;R0](=O)'
remove["Aldehyde aryl"]='=O'
   
functions["Ketone alkyl"]='C[C;R0](=O)C'
remove["Ketone alkyl"]='=O'
   
functions["Ketone aryl"]='c[C;R0](=O)c'
remove["Ketone aryl"]='=O'

functions["Ester alkyl"]='C[C;R0](=O)OC'
remove["Ester alkyl"]='OO'
   
functions["Ester aryl"]='c[C;R0](=O)OC'
remove["Ester aryl"]='OOC'
    
functions["Ether alkyl"]='C[O;R0]C'
remove["Ether alkyl"]=''
    
functions["Ether aryl"]='C[O;R0]c'
remove["Ether aryl"]=''
    
functions["Michael acc alkyl"]='C[C;R0](=O)[C;R0]=[C;R0]'
remove["Michael acc alkyl"]=''
    
functions["Michael acc aryl"]='c[C;R0](=O)[C;R0]=[C;R0]'
remove["Michael acc aryl"]=''

functions["Anhydride alkyl"]='C[C;R0](=O)O[C;R0](=O)C'
remove["Anhydride alkyl"]=''
   
functions["Anhydride aryl"]='c[C;R0](=O)O[C;R0](=O)c'
remove["Anhydride aryl"]=''
   
functions["Dicarbonyl 1-3 alkyl"]='C[C;R0](=O)[CH2][C;R0](=O)C'
remove["Dicarbonyl 1-3 alkyl"]='OO'
   
functions["Dicarbonyl 1-3 aryl"]='c[C;R0](=O)[CH2][C;R0](=O)c'
remove["Dicarbonyl 1-3 aryl"]='OO'
    
functions["Dicarbonyl 1-4 alkyl"]='C[C;R0](=O)[CH2][CH2][C;R0](=O)C'
remove["Dicarbonyl 1-4 alkyl"]='OO'
   
functions["Dicarbonyl 1-4 aryl"]='c[C;R0](=O)[CH2][CH2][C;R0](=O)c'
remove["Dicarbonyl 1-4 aryl"]='OO'
   
functions["Ketone alpha halide"]='C[C;R0](=O)[CH2][Cl,Br,I]'
remove["Ketone alpha halide"]='O'
   
functions["Ketone beta halide"]='C[C;R0](=O)[CH2][CH2][Cl,Br,I]'
remove["Ketone beta halide"]='O'
    
functions["Epoxyde alkyl"]='C1OC1C'
remove["Epoxyde alkyl"]=''
   
functions["Epoxyde aryl"]='C1OC1c'
remove["Epoxyde aryl"]=''
   
functions["Acyl chloride alkyl"]='C[C;R0](Cl)=O'
remove["Acyl chloride alkyl"]=''

functions["Acyl chloride aryl"]='c[C;R0](Cl)=O'
remove["Acyl chloride aryl"]=''

functions["Thioether alkyl"]='C[S;R0]C'
remove["Thioether alkyl"]=''

functions["Thioether aryl"]='C[S;R0]c'
remove["Thioether aryl"]=''

functions["Thiol alkyl"]='C[SH]'
remove["Thiol alkyl"]='H'

functions["Thiol aryl"]='c[SH]'
remove["Thiol aryl"]='H'

functions["Amide 1"]='[#6][C;R0](=[OD1])[NH2]'
remove["Amide 1"]='H'
   
functions["Amide 2"]='[#6][C;R0](=[OD1])[NH][#6]'
remove["Amide 2"]='H'
    
functions["Amide alkyl"]='C[C;R0]([NH2])=O'
remove["Amide alkyl"]='H'
  
functions["Amide aryl"]='c[C;R0]([NH2])=O'
remove["Amide aryl"]='O/NH'
    
functions["Isocyanate alkyl"]='CN=C=O'
remove["Isocyanate alkyl"]='C=O'
    
functions["Isocyanate aryl"]='cN=C=O'
remove["Isocyanate aryl"]='C=O'
   
functions["Nitro alkyl"]='C[N+]([O-])=O'
remove["Nitro alkyl"]=''
    
functions["Nitro aryl"]='c[N+]([O-])=O'
remove["Nitro aryl"]=''
    
functions["Imide alkyl"]='C[C;R0](=O)N[C;R0](=O)C'
remove["Imide alkyl"]='/NH'
   
functions["Imide aryl"]='c[C;R0](=O)N[C;R0](=O)c'
remove["Imide aryl"]='/NH'

functions["Thioester alkyl"]='C[C;R0](=S)OC'
remove["Thioester alkyl"]=''
   
functions["Thioester aryl"]='c[C;R0](=S)OC'
remove["Thioester aryl"]=''
   
functions["Vinylsulfonyl Alkyl"]='C[S;R0](=O)(=O)[C;R0]=[C;R0]'
remove["Vinylsulfonyl Alkyl"]=''
    
functions["Vinylsulfonyl Aryl"]='c[S;R0](=O)(=O)[C;R0]=[C;R0]'
remove["Vinylsulfonyl Aryl"]=''
    
functions["Sulfonate ester alkyl"]='[#6][O;R0][S;R0](=O)(=O)[#6]'
remove["Sulfonate ester alkyl"]=''
   
functions["Sulfonate ester aryl"]='c[S;R0](=O)(=O)Oc'
remove["Sulfonate ester aryl"]='S(=O)(=O)Oc'
    
functions["Sulfonylhalide alkyl"]='C[S;R0](Cl)(=O)=O'
remove["Sulfonylhalide alkyl"]='Cl'
   
functions["Sulfonylhalide aryl"]='c[S;R0](Cl)(=O)=O'
remove["Sulfonylhalide aryl"]='Cl'

functions["Thioamide alkyl 1"]='C[C;R0]([NH2])=S'
remove["Thioamide alkyl 1"]='/NH'
   
functions["Thioamide alkyl 2"]='c[C;R0]([NH2])=S'
remove["Thioamide alkyl 2"]='/NH'
  
functions["Thioisocyanate alkyl"]='CN=C=S'
remove["Thioisocyanate alkyl"]='N=C=S'
   
functions["Thioisocyanate aryl"]='cN=C=S'
remove["Thioisocyanate aryl"]='N=C=S'

functions["Sulfonamide alkyl"]='C[S;R0]([NH2])(=O)=O'
remove["Sulfonamide alkyl"]='/NH'
   
functions["Sulfonamide aryl"]='c[S;R0]([NH2])(=O)=O'
remove["Sulfonamide aryl"]='/NH'
   
functions["Alkyne alkyl"]='CC#C'
remove["Alkyne alkyl"]='HC#C'
   
functions["Alkyne aryl"]='cC#C'
remove["Alkyne aryl"]='HC#C'

functions["Alkene alkyl"]='C[C;R0]=[C;R0]'
remove["Alkene alkyl"]=''
   
functions["Alkene aryl"]='c[C;R0]=[C;R0]'
remove["Alkene aryl"]=''
    
functions["Halide alkyl Cl"]='[CH2]Cl'
remove["Halide alkyl Cl"]='Cl'
    
functions["Halide aryl Cl"]='cCl'
remove["Halide aryl Cl"]='Cl'
   
functions["Halo pyrimidine Cl"]='Clc1ncccn1'
remove["Halo pyrimidine Cl"]='Cl'

functions["Halide alkyl Br"]='[CH2]Br'
remove["Halide alkyl Br"]='Br'

functions["Halide aryl Br"]='cBr'
remove["Halide aryl Br"]='Br'

functions["Halo pyrimidine Br"]='Brc1ncccn1'
remove["Halo pyrimidine Br"]='Br'

functions["Halide alkyl I"]='[CH2]I'
remove["Halide alkyl I"]='I'

functions["Halide aryl I"]='cI'
remove["Halide aryl I"]='I'

functions["Halo pyrimidine I"]='Ic1ncccn1'
remove["Halo pyrimidine I"]='I'
    
    


def substruct(smiles, function):
    m = Chem.MolFromSmiles(smiles)
    m=AllChem.AddHs(m)
    params = Chem.SmilesParserParams()
    params.removeHs=False
    m=Chem.MolFromSmiles(AllChem.MolToSmiles(m),params)
    print(Chem.MolToSmiles(m))

    tmp=Chem.MolFromSmarts(functions[function])
    try:
        tmp2=AllChem.AddHs(tmp)
        print(m.GetSubstructMatches(tmp2))
    except:
        print(m.GetSubstructMatches(tmp))

    print(remove[function])

if __name__== '__main__':
   smiles=sys.argv[1]
   function=sys.argv[2]
   substruct(smiles, function)
  