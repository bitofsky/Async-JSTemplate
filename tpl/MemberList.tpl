<script id="MemberList">
AJST MemberList Sample..
<?include('MemberList.table', data)?>
</script>

<script id="MemberList.table">
<table class="table">
  <caption>Member List Table</caption>
  <?include('MemberList.thead', data)?>
  <?include('MemberList.tbody', data)?>
</table>
</script>

<script id="MemberList.thead">
<thead><th><?=Object.keys(data[0]).join('</th><th>')?></th></thead>
</script>

<script id="MemberList.tbody">
<tbody>
<?
  data.forEach(function(member, idx){
    print('<tr>');
    for( var key in member )
      printf('<td>%s</td>', member[key]);
    print('</tr>\n');
  });
?>
</tbody>
</script>