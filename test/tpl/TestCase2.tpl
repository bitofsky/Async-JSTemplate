<script id="Template Output String">
Outside Tag. Output String.
<?
  // inside tag.
  print('Inside Tag. use print() or printf().');
?>
Closed Tag. Output String.
<?='And <?=Output?\>'?>
</script>

<script id="print">
<?[1,2,3].forEach(function(num){
  print(num + ' + ' + num + ' = ' + (num+num) + '\n');
})?>
</script>

<script id="printf">
<?[1.1,2.2,3.3].forEach(function(num){
  printf('%d + %d = %.3f\n', num, num, num+num);
})?>
</script>

<script id="sprintf">
<?[1.1,2.2,3.3].forEach(function(num){
  var output = sprintf('%d + %d = %.3f\n', num, num, num+num);
  print(output);
})?>
</script>

<script id="util.tag_escape, util.tag_unescape">
original  = <?=data.tag?>
escaped   = <?=util.tag_escape(data.tag)?>
unescaped = <?=util.tag_unescape(util.tag_escape(data.tag))?>
</script>

<script id="option.global definition.">
<?[1,2,3].forEach(function(num){
  print(num + ' + ' + num + ' = ' + add(num, num) + '\n');
})?>
jQuery($) Ready?
"<?=$() instanceof jQuery ? "I am ready" : "not ready"?>"
</script>