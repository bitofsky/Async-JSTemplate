<script id="Template data"><?=data?></script>

<script id="Array data"><?=data.join(', ')?></script>

<script id="Object data">
<?
data.list.forEach(function(i){
  printf('%d + %d = %d\n', i, i, data.add(i,i));
});
?>
</script>

<script id="Remote Data">data.items.length = <?=data.items.length?></script>