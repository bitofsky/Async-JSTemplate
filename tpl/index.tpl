<script id="index">
<!-- navbar -->
<div class="navbar navbar-inverse navbar-fixed-top">
  <a class="navbar-brand" href="/#About">AJST</a>
  <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".nav-collapse">
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
  </button>
  <div class="nav-collapse collapse">
    <ul class="nav navbar-nav">
      <?includeEach('navbar.btn', data.navLeft)?>
    </ul>
    <ul class="nav navbar-nav pull-right">
      <?includeEach('navbar.btn', data.navRight)?>
    </ul>
  </div>
</div>
<!-- navbar -->

<!-- container -->
<div class="container"></div>
<!-- container -->
</script>

<script id="navbar.btn">
<li>
  <a class="visible-md" name="<?=data.name?>" href="<?=data.href?>"><?=data.text?></a>
  <a class="hidden-md" name="<?=data.name?>" href="<?=data.href?>"><?=data.icon ? sprintf('<i class="%s"></i> %s', data.icon, data.text) : data.text?></a>
</li>
</script>
