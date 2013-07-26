<script id="navbar">
<?var makeBtn = function(btn){ printf('<li class="%s"><a href="%s">%s</a></li>', (btn.active?'active':''), btn.href, btn.text); };?>
<!-- navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container-fluid">
      <a class="brand" href="#">AJST</a>
      <div class="nav-collapse collapse">
        <ul class="nav">
          <?includeEach('navbar.btn', data.buttonLeft)?>
        </ul>
        <ul class="nav pull-right">
          <?includeEach('navbar.btn', data.buttonRight)?>
        </ul>
      </div>
    </div>
  </div>
</div>
<!-- navbar -->
</script>

<script id="navbar.btn">
<li class="<?=data.active?'active':''?>"><a href="<?=data.href?>"><?=data.text?></a></li>
</script>

<script id="container">
<!-- container -->
<div class="container-fluid">
  <div class="row-fluid">
    <div class="span2">
      <div class="well sidebar-nav">
        <ul class="nav nav-list" id="TestList">
          <li class="nav-header">Test List</li>
        </ul>
      </div><!--/.well -->
    </div><!--/span-->
    <div class="span10" >
      <div class="accordion" id="Result">
      </div>
    </div><!--/span-->
  </div><!--/row-->

</div><!--/.fluid-container-->
<!-- container -->
</script>