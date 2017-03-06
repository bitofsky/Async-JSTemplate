<script id="UnitTest">
<div class="row">
  <div class="col-12 col-sm-4">
    <div class="affix-top">
      <ul class="nav nav-pills nav-stacked" id="TestList">

        <li class="nav-header">Test List</li>

        <?
          for( var name in data.TestGroups )
            printf('<li class="%s"><a href="#UnitTest/%s"><i class="icon-check"></i><i class="icon-check-empty"></i> %s</a></li>', name==data.caseName ? 'active':'', name, name);
        ?>

      </ul>
    </div>
  </div>

  <div class="col-12 col-sm-8">
    <div class="accordion" id="Result">
      <h3><?=data.caseName?></h3>

      <?
        var idx = 1;
        util.each(data.TestGroups[data.caseName], function(testData, name){
          testData.idx = idx++;
          include('UnitTestResult', testData);
        });
      ?>

    </div>
  </div>
</div>
</script>

<script id="UnitTestResult">
<? var id = util.makeUID(); ?>
<div class="accordion-group" name="<?=data.name?>">
  <div class="accordion-heading">
    <span class="label"><i class="icon-play-circle"></i> <span class="label-text">Waiting..</span></span>
    <a class="accordion-toggle inline" href="#<?=id?>" data-toggle="collapse" data-parent="#Result">Test <?=data.idx?> : <?=data.name?></a>
  </div>
  <div class="accordion-body collapse" id="<?=id?>">
    <div class="accordion-inner">
    </div>
  </div>
</div>
</script>
