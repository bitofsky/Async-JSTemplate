<script id="navbar">
<?var makeBtn = function(btn){ printf('<li class="%s"><a href="%s">%s</a></li>', (btn.active?'active':''), btn.href, btn.text); };?>
<!-- navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
  <a class="navbar-brand" href="#">AJST</a>
  <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".nav-collapse">
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
  </button>
  <div class="nav-collapse collapse">
    <ul class="nav navbar-nav">
      <?includeEach('navbar.btn', data.buttonLeft)?>
    </ul>
    <ul class="nav navbar-nav pull-right">
      <?includeEach('navbar.btn', data.buttonRight)?>
    </ul>
  </div>
</div>
<!-- navbar -->
</script>

<script id="navbar.btn">
<li class="<?=data.active?'active':''?>"><a href="<?=data.href?>"><?=data.icon ? sprintf('<i class="%s"></i> %s', data.icon, data.text) : data.text?></a></li>
</script>

<script id="container">
<!-- container -->
<div class="container">
  <div class="row">

    <div class="col-12 col-sm-4">
      <div class="affix-top">
        <ul class="nav" id="TestList">
          <li class="nav-header">Test List</li>
        </ul>
      </div>
    </div>

    <div class="col-12 col-sm-8">
      <div class="accordion" id="Result">
      </div>
    </div>

  </div>

</div>
<!-- container -->
</script>