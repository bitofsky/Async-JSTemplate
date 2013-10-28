<script id="Include TPL">
<?include($id+'.sub')?>
</script>

<script id="Include TPL.sub">
This is Include TPL.sub
</script>

<script id="Include other tpl file"><?include('include1')?></script>

<script id="Include more..">
<?include('include2')?>
</script>

<script id="Include multiple promise">
Succeed!
</script>

<script id="Include with Data">
<?include('Include Data Result', {result:'abc'})?>
</script>

<script id="Include with Ajax Data">
<?includeAjax('Include Ajax Result', 'data/sampledata.json')?>
</script>

<script id="Include with Promise Data">
<?include('Include Ajax Result', $.getJSON('data/sampledata.json'))?>
</script>

<script id="Include Data Result">
result=<?=data.result?>
</script>

<script id="Include Ajax Result">
<?=data.items[1].label?>
</script>
