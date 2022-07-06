<?php

// Comparison between similar elements between two array
function comparisonArray(array $array1, array $array2,$onceEachElmt=false){
    $y= array(); 
    for($i=0; $i<count($array1); $i++){
        for($j=0; $j<count($array2); $j++){
            if($array1[$i] == $array2[$j]){
                $y[] = $array1[$i];
                if($onceEachElmt === true){
                  break 1;
                }
            }
        }            
    }
    return $y;
}

function extractDataArrays(array $array,$i){
    $y= array();
    for($j=0; $j<count($array[$i]); $j++){
        if(!empty($array[$i][$j])){
            $y[]= $array[$i][$j];
        }
    }
    return $y;
}

// Sort ascending data by sorting fusion
function sortingFusion($array){
    if(count($array) <= 1){
        return $array;
    }
    else{
        $array1= array();
        $array2= array();
        
        for($i=0; $i < count($array); $i++){
            if($i < (count($array)/2)){
                $array1[]= $array[$i];
            }else{
                $array2[]= $array[$i];
            }
        }
        
        return fusion(sortingFusion($array1),sortingFusion($array2));
    }
}

function fusion($array1, $array2){
    $lenA1= count($array1);
    $lenA2= count($array2);
    $array= array_fill("0", $lenA1+$lenA2, "0");
    $i= 0;
    $j= 0;
    $k= 0;
    
    while($i < $lenA1 OR $j < $lenA2){
        if($j == $lenA2 || ($i < $lenA1 and $array1[$i] <= $array2[$j])){
            $array[$k]= $array1[$i];
            $i = $i + 1;
        }else{
            $array[$k]= $array2[$j];
            $j= $j + 1;
        }
        $k= $k+1;
    }
    return $array;
}
?>