<script id="Hello AJST!">
Hello!!
</script>

<script id="Condition: if else">
<?if( true ){?>
is true
<?} else {?>
is false
<?}?>
</script>

<script id="Condition: switch case">
<?switch(true){
 case true  : ?>True<?  break;
 case false : ?>False<? break;
}?>
</script>

<script id="For">
<?for(var i=1; i<=3; i++){?>
  i = <?=i?>
<?}?>
</script>

<script id="For key:value">
<?
var o = {1:'A',2:'B',3:'C'};
for( var key in o ){?>
  key = <?=key?>
  value = <?=o[key]?>
<?}?>
</script>

<script id="ForEach">
<?[1,2,3].forEach(function(i, idx){?>
  i = <?=i?>
<?});?>
</script>

<script id="Sub function">
<?
var add = function(a,b){ return +a + +b; };
[1,2,3].forEach(function(i){?>
  <?=i?> + <?=i?> = <?=add(i, i)?><?
});
?>
</script>