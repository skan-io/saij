<table><tr>
<th width="33.3%">Engine</th><th width="33.3%">Interpreter</th><th width="33.3%">Analyzer</th>
</tr><tr>
<td><p>An [engine](module-saij_Engine-Engine.html) is made up of an [interpreter](module-saij_interpreter_Base-Interpreter.html), an [analyzer](module-saij_Analyzer-Analyzer.html) and a [reactor](module-saij_interaction_Interaction-Interaction.html). Together they will be formed into
a pipeline by the saij engine.</p>
[Overview](module-saij_Engine-Engine.html)<br>
[Creation](module-saij_Engine-Engine.html#Engine)<br>
[Events](module-saij_SaijEvent-SaijEvent.html)</td>
<td><p>The interpreter manages raw input encoding and decoding, translations, nlp and deconstruction of words, sentences and phrases.</p>
[Interpreter](module-saij_Interpreter-Interpreter.html) with parser and translator</td>
<td>
<p>The analyzer organizes and distributes data through the layers.  It also provides [Feedback](module-saij_Interpreter-Interpreter.html) to any [layer/Model](module-saij_Interpreter-Interpreter.html) or [layer/Math](module-saij_Interpreter-Interpreter.html)</p>
[Analyzer](module-saij_Interpreter-Interpreter.html) with layers and feedback.
</td>
</tr><tr>
<th>Layers</th><th>Reactor</th><th>Plugins and Models</th>
</tr><tr>
<td>
<p>Layers are lightweight containers that get their functionality from [plugins](module-ol_source_Source-Source.html) and [models](module-ol_source_Source-Source.html).</p>
[layer/Math](module-ol_layer_VectorTile-VectorTileLayer.html)<br>
[layer/Model](module-ol_layer_Vector-VectorLayer.html)<br>
[layer/Neural](module-ol_layer_Tile-TileLayer.html)<br>
[layer/Request](module-ol_layer_Image-ImageLayer.html)<br>
[layer/Skill](module-ol_layer_VectorTile-VectorTileLayer.html)
</td>
<td>
<p>The reactor is a session configured module that will decide stimulus attention, ingest a stimulus when given an analysis, decide the response.</p>
[Reactor stimulus](module-ol_interaction.html#~defaults)<br>
[Reactor response](module-ol_interaction.html#~defaults)<br>
<ul><li>[response/Action](module-ol_interaction_Select-Select.html)</li>
<li>[response/Message](module-ol_interaction_Draw-Draw.html)</li>
<li>[response/Mood](module-ol_interaction_Modify-Modify.html)</li></ul>
[All interactions](module-ol_interaction_Interaction-Interaction.html)</td>
<td>[Math plugins](module-ol_source_Tile-TileSource.html) and [Math models](module-ol_source_Vector-VectorSource.html) for [layer/Math](module-ol_layer_Tile-TileLayer.html)
<br>[Neural plugins](module-ol_source_Vector-VectorSource.html) and [Neural models](module-ol_source_Vector-VectorSource.html) for [layer/Neural](module-ol_layer_Vector-VectorLayer.html)
<br>[Request plugins](module-ol_source_Image-ImageSource.html) for [layer/Request](module-ol_layer_Image-ImageLayer.html)
<br>[Skill plugins](module-ol_source_VectorTile-VectorTile.html) for [layer/Skill](module-ol_layer_VectorTile-VectorTileLayer.html)
<br>[Formats](module-ol_format_Feature-FeatureFormat.html) for reading/writing model data
<br>[format/Models](module-ol_format_WMSCapabilities-WMSCapabilities.html)</td></tr>
<tr><th>Plugins</th><th>Observable objects</th><th>Use in components</th></tr>
<tr><td><p>All plugins have to conform to the plugin structure outline in [Base plugin](module-ol_source_VectorTile-VectorTile.html)
in order to be sucessfully run by the engine</td>
<td><p>Changes to all [saij/Object](module-ol_Object-BaseObject.html)s can be observed by calling the [object.on('propertychange')](module-ol_Object-BaseObject.html#on) method.  Listeners receive a [saij/Object~ObjectEvent](module-ol_Object-ObjectEvent.html) with information on the changed property and old value.</p>
<td>
[saij/Target](module-ol_Geolocation.html)<br>
[saij/React](module-ol_Overlay-Overlay.html)<br></td>
</tr></table>

&nbsp;

#### API change policy

The saij API consists of
* names and signatures of constructors
* names and signatures of instance methods and properties
* names and signatures of functions
* names of constants

Within a major release series, the API will not be changed.  Any changes to the API will be accompanied by a new major release.

*Note*: The API change policy does not cover internal use functions. It also does not cover any typedefs and enums.
