#!/usr/bin/env python3

#Searching a chemical function in a given smiles molecule, then return the result

from rdkit import Chem

from rdkit.Chem.Draw import rdMolDraw2D

from rdkit.Chem.Draw import IPythonConsole

from rdkit.Chem import AllChem

import re



#Search chemical function (returns the index where the fct is, and its name)

def searchFct(smiles):

    

    m = Chem.MolFromSmiles(smiles)

    

    #B

    boronate_alkyl=Chem.MolFromSmarts('OB(O)C')

    boronate_alkyl.name="Boronate alkyl"

    boronate_alkyl.exclu=[]

    boronate_aryl=Chem.MolFromSmarts('OB(O)c')

    boronate_aryl.name="Boronate aryl"

    boronate_aryl.exclu=[]

    

    #N

    #primaire=Chem.MolFromSmarts('[NH2;!$(N~[C,S,P,N]=[O,S,N]);!$(N#[C,N]);!$(N=C)]')

    #primaire.name="Amine Primaire"

    #secondaire=Chem.MolFromSmarts('[NH1;!$(N~[C,S,P,N]=[O,S,N]);!$(N#[C,N]);!$(N=C)]')

    #secondaire.name="Amine secondaire"


    amine_prim_alkyl=Chem.MolFromSmarts('C[NH2]')

    amine_prim_alkyl.name="Amine primaire alkyl"

    amine_prim_alkyl.exclu=[]


    amine_sec_alkyl=Chem.MolFromSmarts('C[NH]C')

    amine_sec_alkyl.name="Amine secondaire alkyl"

    amine_sec_alkyl.exclu=[]

    amine_tert_alkyl=Chem.MolFromSmarts('CN(C)C')

    amine_tert_alkyl.name="Amine tertiaire alkyl"

    amine_tert_alkyl.exclu=[]

    amine_prim_aryl=Chem.MolFromSmarts('c[NH2]')

    amine_prim_aryl.name="Amine primaire aryl"

    amine_prim_aryl.exclu=[]

    amine_sec_aryl=Chem.MolFromSmarts('c[NH]c')

    amine_sec_aryl.name="Amine secondaire aryl"

    amine_sec_aryl.exclu=[]

    amine_tert_aryl=Chem.MolFromSmarts('cN(C)C')

    amine_tert_aryl.name="Amine tertiaire aryl"

    amine_tert_aryl.exclu=[]

    nitrile_alkyl=Chem.MolFromSmarts('CC#N')

    nitrile_alkyl.name="Nitrile alkyl"

    nitrile_alkyl.exclu=[]

    nitrile_aryl=Chem.MolFromSmarts('cC#N')

    nitrile_aryl.name="Nitrile aryl"

    nitrile_aryl.exclu=[]

    aziridine_alkyl=Chem.MolFromSmarts('C1NC1C')

    aziridine_alkyl.name="Aziridine alkyl"

    aziridine_alkyl.exclu=["Amine secondaire alkyl"]

    aziridine_aryl=Chem.MolFromSmarts('C1NC1c')

    aziridine_aryl.name="Aziridine aryl"

    aziridine_aryl.exclu=["Amine secondaire alkyl"]

    imine_alkyl=Chem.MolFromSmarts('[C;R0](=N)C')

    imine_alkyl.name="Imine alkyl"

    imine_alkyl.exclu=[]

    imine_aryl=Chem.MolFromSmarts('[C;R0](=N)c')

    imine_aryl.name="Imine aryl"

    imine_aryl.exclu=[]

    azide_alkyl=Chem.MolFromSmarts('[N-]=[N+]=NC')

    azide_alkyl.name="Azide alkyl"

    azide_alkyl.exclu=[]

    azide_aryl=Chem.MolFromSmarts('[N-]=[N+]=Nc')

    azide_aryl.name="Azide aryl"

    azide_aryl.exclu=[]

    amidine_alkyl=Chem.MolFromSmarts('C[C;R0](N)=N')

    amidine_alkyl.name="Amidine alkyl"

    amidine_alkyl.exclu=["Imine alkyl","Amine primaire alkyl"]

    amidine_aryl=Chem.MolFromSmarts('c[C;R0](N)=N')

    amidine_aryl.name="Amidine aryl"

    amidine_aryl.exclu=["Imine aryl","Amine primaire alkyl"]

    hydrazine_alkyl=Chem.MolFromSmarts('C[NH;R0][NH2;R0]')

    hydrazine_alkyl.name="Hydrazine alkyl"

    hydrazine_alkyl.exclu=[]

    hydrazine_aryl=Chem.MolFromSmarts('c[NH;R0][NH2;R0]')

    hydrazine_aryl.name="Hydrazine aryl"

    hydrazine_aryl.exclu=[]

    

    #O

    alcool=Chem.MolFromSmarts('[OH;R0][#6;!$([#6]=[O,S])]')

    alcool.name="Alcool"

    alcool.exclu=[]

    alcohol_alkyl=Chem.MolFromSmarts('C[OH]')

    alcohol_alkyl.name="Alcohol Alkyl"

    alcohol_alkyl.exclu=["Alcool"]
    
    alcohol_alkyl2=Chem.MolFromSmarts('[O-]C(=O)')
    
    alcohol_alkyl2.name="Alcohol Alkyl"

    alcohol_alkyl2.exclu=[]

    alcohol_aryl=Chem.MolFromSmarts('c[OH]')

    alcohol_aryl.name="Alcohol Aryl"

    alcohol_aryl.exclu=["Alcool"]

    acid_alkyl=Chem.MolFromSmarts('C[C;R0]([OH])=O')

    acid_alkyl.name="Acide alkyl"

    acid_alkyl.exclu=["Alcohol Alkyl"]
    
    acid_alkyl2=Chem.MolFromSmarts('[O-]C(=O)C')
    
    acid_alkyl2.name="Acide alkyl"

    acid_alkyl2.exclu=["Alcohol Alkyl"]

    acid_aryl=Chem.MolFromSmarts('c[C;R0]([OH])=O')

    acid_aryl.name="Acide aryl"

    acid_aryl.exclu=["Alcohol Alkyl"]
    
    acid_aryl2=Chem.MolFromSmarts('[O-]C(=O)c')
    
    acid_aryl2.name="Acide aryl"

    acid_aryl2.exclu=["Alcohol Alkyl"]

    aldehyde_alkyl=Chem.MolFromSmarts('C[CH1;R0](=O)')

    aldehyde_alkyl.name="Aldehyde alkyl"

    aldehyde_alkyl.exclu=[]

    aldehyde_aryl=Chem.MolFromSmarts('c[CH1;R0](=O)')

    aldehyde_aryl.name="Aldehyde aryl"

    aldehyde_aryl.exclu=[]

    ketone_alkyl=Chem.MolFromSmarts('C[C;R0](=O)C')

    ketone_alkyl.name="Ketone alkyl"

    ketone_alkyl.exclu=[]

    ketone_aryl=Chem.MolFromSmarts('c[C;R0](=O)c')

    ketone_aryl.name="Ketone aryl"

    ketone_aryl.exclu=[]

    ester_alkyl=Chem.MolFromSmarts('C[C;R0](=O)OC')

    ester_alkyl.name="Ester alkyl"

    ester_alkyl.exclu=["Ether alkyl"]

    ester_aryl=Chem.MolFromSmarts('c[C;R0](=O)OC')

    ester_aryl.name="Ester aryl"

    ester_aryl.exclu=["Ether alkyl"]

    ether_alkyl=Chem.MolFromSmarts('C[O;R0]C')

    ether_alkyl.name="Ether alkyl"

    ether_alkyl.exclu=[]

    ether_aryl=Chem.MolFromSmarts('C[O;R0]c')

    ether_aryl.name="Ether aryl"

    ether_aryl.exclu=[]

    michael_acc_alkyl=Chem.MolFromSmarts('C[C;R0](=O)[C;R0]=[C;R0]')

    michael_acc_alkyl.name="Michael acc alkyl"

    michael_acc_alkyl.exclu=["Ketone alkyl","Alkene alkyl"]

    michael_acc_aryl=Chem.MolFromSmarts('c[C;R0](=O)[C;R0]=[C;R0]')

    michael_acc_aryl.name="Michael acc aryl"

    michael_acc_aryl.exclu=["Alkene alkyl"]

    anhydride_alkyl=Chem.MolFromSmarts('C[C;R0](=O)O[C;R0](=O)C')

    anhydride_alkyl.name="Anhydride alkyl"

    anhydride_alkyl.exclu=["Ester alkyl"]


    anhydride_aryl=Chem.MolFromSmarts('c[C;R0](=O)O[C;R0](=O)c')

    anhydride_aryl.name="Anhydride aryl"

    anhydride_aryl.exclu=["Ester aryl"]

    dicarbonyl_1_3_alkyl=Chem.MolFromSmarts('C[C;R0](=O)[CH2][C;R0](=O)C')

    dicarbonyl_1_3_alkyl.name="Dicarbonyl 1-3 alkyl"

    dicarbonyl_1_3_alkyl.exclu=["Ketone alkyl"]

    dicarbonyl_1_3_aryl=Chem.MolFromSmarts('c[C;R0](=O)[CH2][C;R0](=O)c')

    dicarbonyl_1_3_aryl.name="Dicarbonyl 1-3 aryl"

    dicarbonyl_1_3_aryl.exclu=[]

    dicarbonyl_1_4_alkyl=Chem.MolFromSmarts('C[C;R0](=O)[CH2][CH2][C;R0](=O)C')

    dicarbonyl_1_4_alkyl.name="Dicarbonyl 1-4 alkyl"

    dicarbonyl_1_4_alkyl.exclu=["Ketone alkyl"]

    dicarbonyl_1_4_aryl=Chem.MolFromSmarts('c[C;R0](=O)[CH2][CH2][C;R0](=O)c')

    dicarbonyl_1_4_aryl.name="Dicarbonyl 1-4 aryl"

    dicarbonyl_1_4_aryl.exclu=[]

    ketone_alpha_halide=Chem.MolFromSmarts('C[C;R0](=O)[CH2][Cl,Br,I]')

    ketone_alpha_halide.name="Ketone alpha halide"

    ketone_alpha_halide.exclu=["Halide alkyl","Ketone alkyl"]

    ketone_beta_halide=Chem.MolFromSmarts('C[C;R0](=O)[CH2][CH2][Cl,Br,I]')

    ketone_beta_halide.name="Ketone beta halide"

    ketone_beta_halide.exclu=["Halide alkyl","Ketone alkyl"]

    epoxyde_alkyl=Chem.MolFromSmarts('C1OC1C')

    epoxyde_alkyl.name="Epoxyde alkyl"

    epoxyde_alkyl.exclu=[]

    epoxyde_aryl=Chem.MolFromSmarts('C1OC1c')

    epoxyde_aryl.name="Epoxyde aryl"

    epoxyde_aryl.exclu=[]

    acyl_chloride_alkyl=Chem.MolFromSmarts('C[C;R0](Cl)=O')

    acyl_chloride_alkyl.name="Acyl chloride alkyl"

    acyl_chloride_alkyl.exclu=[]

    acyl_chloride_aryl=Chem.MolFromSmarts('c[C;R0](Cl)=O')

    acyl_chloride_aryl.name="Acyl chloride aryl"

    acyl_chloride_aryl.exclu=[]



    

    

    #S

    thioether_alkyl=Chem.MolFromSmarts('C[S;R0]C')

    thioether_alkyl.name="Thioether alkyl"

    thioether_alkyl.exclu=[]

    thioether_aryl=Chem.MolFromSmarts('C[S;R0]c')

    thioether_aryl.name="Thioether aryl"

    thioether_aryl.exclu=[]

    thiol_alkyl=Chem.MolFromSmarts('C[SH]')

    thiol_alkyl.name="Thiol alkyl"

    thiol_alkyl.exclu=[]

    thiol_aryl=Chem.MolFromSmarts('c[SH]')

    thiol_aryl.name="Thiol aryl"

    thiol_aryl.exclu=[]

    

    

    #O & N
    amide1=Chem.MolFromSmarts('[#6][C;R0](=[OD1])[NH2]')

    amide1.name="Amide 1"

    amide1.exclu=[]

    amide2=Chem.MolFromSmarts('[#6][C;R0](=[OD1])[NH][#6]')

    amide2.name="Amide 2"

    amide2.exclu=[]

    amide_alkyl=Chem.MolFromSmarts('C[C;R0]([NH2])=O')

    amide_alkyl.name="Amide alkyl"

    amide_alkyl.exclu=["Amide 1","Amine primaire alkyl"]

    amide_aryl=Chem.MolFromSmarts('c[C;R0]([NH2])=O')

    amide_aryl.name="Amide aryl"

    amide_aryl.exclu=["Amide 1","Amine primaire alkyl"]

    isocyanate_alkyl=Chem.MolFromSmarts('CN=C=O')

    isocyanate_alkyl.name="Isocyanate alkyl"

    isocyanate_alkyl.exclu=[]

    isocyanate_aryl=Chem.MolFromSmarts('cN=C=O')

    isocyanate_aryl.name="Isocyanate aryl"

    isocyanate_aryl.exclu=[]

    nitro_alkyl=Chem.MolFromSmarts('C[N+]([O-])=O')

    nitro_alkyl.name="Nitro alkyl"

    nitro_alkyl.exclu=[]

    nitro_aryl=Chem.MolFromSmarts('c[N+]([O-])=O')

    nitro_aryl.name="Nitro aryl"

    nitro_aryl.exclu=[]

    imide_alkyl=Chem.MolFromSmarts('C[C;R0](=O)N[C;R0](=O)C')

    imide_alkyl.name="Imide alkyl"

    imide_alkyl.exclu=["Amide 2","Amine secondaire alkyl"]

    imide_aryl=Chem.MolFromSmarts('c[C;R0](=O)N[C;R0](=O)c')

    imide_aryl.name="Imide aryl"

    imide_aryl.exclu=["Amide 2","Amine secondaire alkyl"]

   

  

   

    #O & S

    thioester_alkyl=Chem.MolFromSmarts('C[C;R0](=S)OC')

    thioester_alkyl.name="Thioester alkyl"

    thioester_alkyl.exclu=["Ether alkyl"]

    thioester_aryl=Chem.MolFromSmarts('c[C;R0](=S)OC')

    thioester_aryl.name="Thioester aryl"

    thioester_aryl.exclu=["Ether alkyl"]

    vinylsulfonyl_alkyl=Chem.MolFromSmarts('C[S;R0](=O)(=O)[C;R0]=[C;R0]')

    vinylsulfonyl_alkyl.name="Vinylsulfonyl Alkyl"

    vinylsulfonyl_alkyl.exclu=["Thioether alkyl"]

    vinylsulfonyl_aryl=Chem.MolFromSmarts('c[S;R0](=O)(=O)[C;R0]=[C;R0]')

    vinylsulfonyl_aryl.name="Vinylsulfonyl Aryl"

    vinylsulfonyl_aryl.exclu=["Thioether aryl"]

    sulfonate_ester_alkyl=Chem.MolFromSmarts('C[S;R0](=O)(=O)OC')

    sulfonate_ester_alkyl.name="Sulfonate ester alkyl"

    sulfonate_ester_alkyl.exclu=[]

    sulfonate_ester_aryl=Chem.MolFromSmarts('c[S;R0](=O)(=O)Oc')

    sulfonate_ester_aryl.name="Sulfonate ester aryl"

    sulfonate_ester_aryl.exclu=[]

    sulfonylhalide_alkyl=Chem.MolFromSmarts('C[S;R0](Cl)(=O)=O')

    sulfonylhalide_alkyl.name="Sulfonylhalide alkyl"

    sulfonylhalide_alkyl.exclu=[]

    sulfonylhalide_aryl=Chem.MolFromSmarts('c[S;R0](Cl)(=O)=O')

    sulfonylhalide_aryl.name="Sulfonylhalide aryl"

    sulfonylhalide_aryl.exclu=[]

    

    #S & N

    thioamide_alkyl1=Chem.MolFromSmarts('C[C;R0]([NH2])=S')

    thioamide_alkyl1.name="Thioamide alkyl 1"

    thioamide_alkyl1.exclu=["Amine primaire alkyl"]

    thioamide_alkyl2=Chem.MolFromSmarts('c[C;R0]([NH2])=S')

    thioamide_alkyl2.name="Thioamide alkyl 2"

    thioamide_alkyl2.exclu=["Amine primaire alkyl"]

    thioisocyanate_alkyl=Chem.MolFromSmarts('CN=C=S')

    thioisocyanate_alkyl.name="Thioisocyanate alkyl"

    thioisocyanate_alkyl.exclu=[]

    thioisocyanate_aryl=Chem.MolFromSmarts('cN=C=S')

    thioisocyanate_aryl.name="Thioisocyanate aryl"

    thioisocyanate_aryl.exclu=[]

    

    

    #S & N & O

    sulfonamide_alkyl=Chem.MolFromSmarts('C[S;R0]([NH2])(=O)=O')

    sulfonamide_alkyl.name="Sulfonamide alkyl"

    sulfonamide_alkyl.exclu=[]

    sulfonamide_aryl=Chem.MolFromSmarts('c[S;R0]([NH2])(=O)=O')

    sulfonamide_aryl.name="Sulfonamide aryl"

    sulfonamide_aryl.exclu=[]

    

    #else

    alkyne_alkyl=Chem.MolFromSmarts('CC#C')

    alkyne_alkyl.name="Alkyne alkyl"

    alkyne_alkyl.exclu=[]

    alkyne_aryl=Chem.MolFromSmarts('cC#C')

    alkyne_aryl.name="Alkyne aryl"

    alkyne_aryl.exclu=[]

    alkene_alkyl=Chem.MolFromSmarts('C[C;R0]=[C;R0]')

    alkene_alkyl.name="Alkene alkyl"

    alkene_alkyl.exclu=[]

    alkene_aryl=Chem.MolFromSmarts('c[C;R0]=[C;R0]')

    alkene_aryl.name="Alkene aryl"

    alkene_aryl.exclu=[]

    halide_alkyl_Cl=Chem.MolFromSmarts('[CH2]Cl')

    halide_alkyl_Cl.name="Halide alkyl Cl"

    halide_alkyl_Cl.exclu=[]

    halide_aryl_Cl=Chem.MolFromSmarts('cCl')

    halide_aryl_Cl.name="Halide aryl Cl"

    halide_aryl_Cl.exclu=[]

    halo_pyrimidine_Cl=Chem.MolFromSmarts('Clc1ncccn1')

    halo_pyrimidine_Cl.name="Halo pyrimidine Cl"

    halo_pyrimidine_Cl.exclu=["Halide aryl Cl"]

    halide_alkyl_Br=Chem.MolFromSmarts('[CH2]Br')

    halide_alkyl_Br.name="Halide alkyl Br"

    halide_alkyl_Br.exclu=[]

    halide_aryl_Br=Chem.MolFromSmarts('cBr')

    halide_aryl_Br.name="Halide aryl Br"

    halide_aryl_Br.exclu=[]

    halo_pyrimidine_Br=Chem.MolFromSmarts('Brc1ncccn1')

    halo_pyrimidine_Br.name="Halo pyrimidine Br"

    halo_pyrimidine_Br.exclu=["Halide aryl Br"]

    halide_alkyl_I=Chem.MolFromSmarts('[CH2]I')

    halide_alkyl_I.name="Halide alkyl I"

    halide_alkyl_I.exclu=[]

    halide_aryl_I=Chem.MolFromSmarts('cI')

    halide_aryl_I.name="Halide aryl I"

    halide_aryl_I.exclu=[]

    halo_pyrimidine_I=Chem.MolFromSmarts('Ic1ncccn1')

    halo_pyrimidine_I.name="Halo pyrimidine I"

    halo_pyrimidine_I.exclu=["Halide aryl I"]




    

    

    

    fctB = {1:boronate_alkyl, 2:boronate_aryl}

    fctN = {1:imine_alkyl, 2:imine_aryl, 3:amidine_alkyl, 4:amidine_aryl, 5:hydrazine_alkyl, 6:hydrazine_aryl, 7:aziridine_alkyl, 8:aziridine_aryl, 9:nitrile_alkyl, 10:nitrile_aryl, 11:azide_alkyl, 12:azide_aryl, 13:amine_prim_alkyl, 14:amine_prim_aryl, 15:amine_sec_alkyl, 16:amine_sec_aryl, 17:amine_tert_alkyl, 18:amine_tert_aryl}

    fctO = {1:dicarbonyl_1_3_alkyl, 2:dicarbonyl_1_3_aryl, 3:dicarbonyl_1_4_alkyl, 4:dicarbonyl_1_4_aryl, 5:anhydride_alkyl, 6:anhydride_aryl, 7:ether_alkyl, 8:ether_aryl, 9:ester_alkyl, 10:ester_aryl, 11:ketone_alkyl, 12:ketone_aryl, 13:michael_acc_alkyl, 14:michael_acc_aryl,15:aldehyde_alkyl, 16:aldehyde_aryl, 17:acid_alkyl, 18:acid_aryl, 19:alcohol_alkyl, 20:alcohol_aryl, 21:alcool, 22:ketone_alpha_halide, 23:ketone_beta_halide, 24:epoxyde_alkyl, 25:epoxyde_aryl, 26:acyl_chloride_alkyl, 27:acyl_chloride_aryl, 28:alcohol_alkyl2, 29:acid_alkyl2 , 30:acid_aryl2  } 

    fctS = {1:thiol_alkyl, 2:thiol_aryl, 3:thioether_alkyl, 4:thioether_aryl}

    fctON = {1:imide_alkyl, 2:imide_aryl, 3:amide1, 4:amide2, 5:amide_alkyl, 6:amide_aryl, 7:isocyanate_alkyl, 8:isocyanate_aryl, 9:nitro_alkyl, 10:nitro_aryl, 11:sulfonamide_alkyl, 12:sulfonamide_aryl }

    fctOS = {1:thioester_alkyl, 2:thioester_aryl, 3:vinylsulfonyl_alkyl, 4:vinylsulfonyl_aryl, 5:sulfonate_ester_alkyl, 6:sulfonate_ester_aryl, 7:sulfonylhalide_alkyl, 8:sulfonylhalide_aryl,  9:sulfonamide_alkyl, 10:sulfonamide_aryl}

    fctSN = {1:thioamide_alkyl1, 2:thioamide_alkyl2, 3:thioisocyanate_alkyl, 4:thioisocyanate_aryl,  5:sulfonamide_alkyl, 6:sulfonamide_aryl}

    fctElse = {1:halide_alkyl_Cl, 2:halide_aryl_Cl, 3:halo_pyrimidine_Cl, 4:alkyne_alkyl, 5:alkyne_aryl, 6:alkene_alkyl, 7:alkene_aryl,8:halide_alkyl_Br, 9:halide_aryl_Br, 10:halo_pyrimidine_Br,11:halide_alkyl_I, 12:halide_aryl_I, 13:halo_pyrimidine_I}

    dico ={}
    exclu=[]
    posex=[]




    for p in range (len(smiles)) :

     

      #if B is present

      if (smiles[p] == 'B') & (p<len(smiles)):

          

          if smiles[p+1] != 'r':

                

              for i in range (1,len(fctB)+1):

                  t=m.GetSubstructMatches(fctB[i])

                  if (len(t) != 0):
                    dico[fctB[i].name]=t
                    if len(fctB[i].exclu)!=0:
                        exclu.extend(fctB[i].exclu)
                        pos=addpos(t)
                        posex.extend(pos)


                   

           

       

      #if N is present

      if (smiles[p] == 'N') & (p<len(smiles)):

                

              for i in range (1,len(fctN)+1):

                  t=m.GetSubstructMatches(fctN[i])

                  if (len(t) != 0):
                    dico[fctN[i].name]=t
                    if len(fctN[i].exclu)!=0:
                        exclu.extend(fctN[i].exclu)
                        pos=addpos(t)
                        posex.extend(pos)

                    

                    

                    

                                

                   

       

            

      #if O is present
      if (smiles[p] == 'O') & (p<len(smiles)):

                

              for i in range (1,len(fctO)+1):
                t=m.GetSubstructMatches(fctO[i])
                if (len(t) != 0):
                    dico[fctO[i].name]=t
                    if len(fctO[i].exclu)!=0:
                        exclu.extend(fctO[i].exclu)
                        pos=addpos(t)
                        posex.extend(pos)


                   

             

                

      #if S is present

      if (smiles[p] == 'S') & (p<len(smiles)):

                

              for i in range (1,len(fctS)+1):

                  t=m.GetSubstructMatches(fctS[i])
                  if (len(t) != 0):
                    dico[fctS[i].name]=t
                    if len(fctS[i].exclu)!=0:
                        exclu.extend(fctS[i].exclu)
                        pos=addpos(t)
                        posex.extend(pos)

        

        

        

      #if O & N are present

      if (smiles[p] == 'O') & (p<len(smiles)):

          

          for j in range (len(smiles)):

                if (smiles[j] == 'N'):

                

                    for k in range (1,len(fctON)+1):

                        t=m.GetSubstructMatches(fctON[k])

                        if (len(t) != 0):
                            dico[fctON[k].name]=t
                            if len(fctON[k].exclu)!=0:
                                exclu.extend(fctON[k].exclu)
                                pos=addpos(t)
                                posex.extend(pos)

     

        

     #if O & S are present

      if (smiles[p] == 'O') & (p<len(smiles)):

          

          for j in range (len(smiles)):

                if (smiles[j] == 'S'):

                

                    for k in range (1,len(fctOS)+1):

                        t=m.GetSubstructMatches(fctOS[k])

                        if (len(t) != 0):
                            dico[fctOS[k].name]=t
                            if len(fctOS[k].exclu)!=0:
                                exclu.extend(fctOS[k].exclu)
                                pos=addpos(t)
                                posex.extend(pos)

     

        

     

      #if N & S are present

      if (smiles[p] == 'N') & (p<len(smiles)):

          

          for j in range (len(smiles)):

                if (smiles[j] == 'S'):

                

                    for k in range (1,len(fctSN)+1):

                        t=m.GetSubstructMatches(fctSN[k])

                        if (len(t) != 0):
                            dico[fctSN[k].name]=t
                            if len(fctSN[k].exclu)!=0:
                                exclu.extend(fctSN[k].exclu)
                                pos=addpos(t)
                                posex.extend(pos)

      

        

      

      #Halogens and no B/N/O/S atoms

      else:

         for i in range (1,len(fctElse)+1):

             t=m.GetSubstructMatches(fctElse[i])

             if (len(t) != 0):
                dico[fctElse[i].name]=t
                if len(fctElse[i].exclu)!=0:
                    exclu.extend(fctElse[i].exclu)
                    pos=addpos(t)
                    posex.extend(pos)


          

    

    for v in dico:
        pos=str(dico[v])
        pos_tmp=addpos(dico[v])
        trouve=False
        i=0
        h=0
        cpt=0
        compt=0
        pos_finale=""
        while (not trouve) & (i<len(pos)-1):
            if pos_tmp[h] in posex:
                trouve=True
            if(pos[i]==")") & ((pos[i+1]==",")|(i==len(pos)-2)) & (not trouve):
                while (compt<=i+1):
                    pos_finale+=pos[compt]
                    compt+=1
                trouve=False
                cpt+=1
            elif(pos[i]==","):
                h+=1
            i+=1
        if (v not in exclu):
            print(v)
            print(dico[v])
        elif(compt>0):
            print(v)
            print(pos_finale)





def addpos(posi):
    t=str(posi)
    t=t.split(",")
    posex=[]
    for pos in t:
        try:
            x=re.findall('\d+', pos)[0]
            posex.append(x)
        except:
            break
    return posex
import sys

if __name__== '__main__':
   smiles=sys.argv[1]
   searchFct(smiles)

