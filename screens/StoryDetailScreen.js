import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function StoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { story } = route.params;

  const storyContents = {
    "Küçük Prens": `Bir zamanlar uzak bir gezegende yaşayan küçük bir prens varmış. Gezegeni o kadar küçükmüş ki, gün batımını görmek için sandalyesini biraz kaydırması yeterliymiş. Bir gün, gezegeninden ayrılıp diğer gezegenleri keşfetmeye karar vermiş.

Her gezegende farklı insanlarla tanışmış. Birinde kendini çok önemli sanan bir kral, diğerinde sürekli sayı sayan bir iş adamı, bir başkasında ise sürekli kendini tekrarlayan bir fenerci varmış.

Sonunda Dünya'ya gelmiş ve bir çölde bir pilotla karşılaşmış. Pilotun uçağı arızalanmış ve çölde mahsur kalmış. Küçük Prens, pilotla arkadaş olmuş ve ona gezegenlerdeki maceralarını anlatmış.

En çok da gülüne hayranmış. Gezegeninde bıraktığı tek gülü çok özlemiş. Pilotla geçirdiği zaman boyunca, gerçek sevginin ne olduğunu anlamış. Gülüne geri dönmek için yılanın yardımıyla gezegenine dönmüş.

Bu hikaye bize, gerçek sevginin gözle görülemeyeceğini, ancak kalple hissedilebileceğini öğretir. Küçük Prens'in dediği gibi: "En önemli şey gözle görülmez, sadece kalple görülür."`,

    "Alice Harikalar Diyarında": `Alice, bir gün kız kardeşiyle birlikte nehir kenarında otururken, beyaz bir tavşanın koşarak geçtiğini görmüş. Tavşan, cebinden bir saat çıkarıp "Geç kaldım, geç kaldım!" diye bağırmış. Merakına yenik düşen Alice, tavşanı takip etmiş ve bir tavşan deliğine düşmüş.

Deliğin içinde kendini yavaş yavaş düşerken bulmuş. Etrafında uçan kitaplar, raflar ve garip eşyalar varmış. Sonunda yumuşak bir yere inmiş ve kendini Harikalar Diyarı'nda bulmuş.

Burada birçok ilginç karakterle tanışmış: Cheshire Kedisi, Düşes, Şapkacı, Mart Tavşanı ve Kupa Kraliçesi. Her biri Alice'e farklı dersler vermiş. Cheshire Kedisi ona "Herkes delidir" demiş, Şapkacı ise zamanın değerini anlatmış.

Alice, bu macera boyunca kendini tanımış ve büyümenin ne demek olduğunu öğrenmiş. Sonunda uyanıp, bunların hepsinin bir rüya olduğunu anlamış. Ama bu rüya, onun hayatını değiştirmiş.`,

    Pinokyo: `Gepetto Usta, ahşap oymacılığı yapan yaşlı bir adamdı. Bir gün, konuşan bir kukla yapmaya karar verdi. Kuklaya Pinokyo adını verdi. Gece yarısı, Mavi Peri gelip Pinokyo'yu canlandırdı. Ama Pinokyo'nun gerçek bir çocuk olabilmesi için dürüst, cesur ve özverili olması gerekiyordu.

Pinokyo, okula gitmek yerine eğlenceye gitmeyi tercih etti. Yolda Tilki ve Kedi ile tanıştı. Onlar Pinokyo'yu kandırıp eğlence adasına götürdüler. Burada çocuklar eğleniyor ama sonunda eşeğe dönüşüyorlardı.

Pinokyo da eşeğe dönüşmeye başladı. Ama son anda kaçmayı başardı. Eve dönerken babasını aramaya başladı. Babası onu aramak için denize açılmıştı ve bir balina tarafından yutulmuştu.

Pinokyo, balinanın karnına girdi ve babasını buldu. Birlikte kaçmayı başardılar. Bu cesur davranışı sayesinde Mavi Peri, Pinokyo'yu gerçek bir çocuğa dönüştürdü. Artık Pinokyo, dürüst ve çalışkan bir çocuk olmuştu.`,

    "Peter Pan": `Peter Pan, Neverland adlı büyülü bir adada yaşayan, hiç büyümeyen bir çocuktu. Bir gece, Wendy ve kardeşleri John ile Michael'ın penceresine kondu ve onları Neverland'e götürdü.

Neverland'de Kızılderililer, deniz korsanları ve periler yaşıyordu. En tehlikelisi ise Kaptan Hook'du. Peter Pan ve Kayıp Çocuklar, Hook ve tayfasıyla sürekli mücadele ediyorlardı.

Wendy, çocuklara annelik yapmaya başladı. Onlara hikayeler anlatıyor, yaralarını sarıyordu. Ama bir gün Kaptan Hook, Wendy ve kardeşlerini kaçırdı.

Peter Pan, Tinker Bell'in yardımıyla Wendy ve kardeşlerini kurtardı. Son bir mücadelede Hook'u yendi ve onu timsahın ağzına attı. Wendy ve kardeşleri eve döndüler, ama Peter Pan hala Neverland'de yaşamaya devam etti.`,

    "Kırmızı Başlıklı Kız": `Kırmızı Başlıklı Kız, büyükannesine pasta götürmek için yola çıktı. Annesi ona "Yoldan çıkma ve kimseyle konuşma" diye tembih etti. Ama Kırmızı Başlıklı Kız, ormanda karşılaştığı kurtla konuştu.

Kurt, büyükannenin evinin yolunu öğrendi ve oraya koştu. Büyükannesi kapıyı açınca onu yuttu ve büyükannenin kıyafetlerini giyip yatağına yattı.

Kırmızı Başlıklı Kız geldiğinde, büyükannesinin kulaklarının, gözlerinin ve dişlerinin ne kadar büyük olduğunu fark etti. Kurt, "Seni yemek için bekliyorum!" diye bağırdı ve Kırmızı Başlıklı Kız'ı da yuttu.

Tam o sırada bir avcı geçiyordu. Kurtun karnının şiş olduğunu görünce şüphelendi. Kurtun karnını yardı ve Kırmızı Başlıklı Kız ile büyükannesini kurtardı. Kurtun karnına taş doldurup dikti. Kurt uyanınca taşların ağırlığından öldü.`,

    "Pamuk Prenses": `Pamuk Prenses, güzelliğiyle ünlü bir prensesti. Üvey annesi Kraliçe, aynaya sorduğunda en güzelin Pamuk Prenses olduğunu öğrenince çok kızdı. Avcıya Pamuk Prenses'i öldürmesini emretti.

Avcı, Pamuk Prenses'i öldürmeye kıyamadı ve ormanda bıraktı. Pamuk Prenses, yedi cücelerin evini buldu. Cüceler onu evlerinde kalmaya davet ettiler.

Kraliçe, Pamuk Prenses'in hala yaşadığını öğrenince, zehirli bir elma hazırladı. Yaşlı bir kadın kılığında Pamuk Prenses'e elmayı yedirdi. Pamuk Prenses öldü.

Cüceler, Pamuk Prenses'i cam bir tabuta koydular. Bir prens geçerken onu gördü ve aşık oldu. Tabutu öperken, Pamuk Prenses uyandı. Prens ve Pamuk Prenses evlendiler, Kraliçe ise cezasını buldu.`,

    "Uzay Macerası": `Ali ve Ayşe, bir gece gökyüzünde parlak bir ışık gördüler. Bu ışık, uzaydan gelen bir uzay gemisiydi. Gemiden inen uzaylılar, onları gezegenlerine davet ettiler.

Uzay gemisiyle yolculuk yaparken, güneş sistemindeki gezegenleri ziyaret ettiler. Mars'ta kırmızı kum tepelerinde oynadılar, Jüpiter'in uydularında buz pateni yaptılar, Satürn'ün halkalarında kaydılar.

Sonunda uzaylıların gezegenine vardılar. Burada her şey farklıydı: Ağaçlar mor, gökyüzü yeşil, denizler pembe renkteydi. Uzaylı çocuklarla oyunlar oynadılar, uzaylı yemeklerini tattılar.

Dünya'ya dönmeden önce, uzaylılar onlara bir hediye verdiler: Bir uzay taşı. Bu taş, karanlıkta parlayan ve dilek tutan bir taştı. Ali ve Ayşe, bu taşı her gece yastıklarının altına koydular ve uzay maceralarını hatırladılar.`,

    "Ormanın Sırrı": `Zeynep, büyükannesinin evinin yakınındaki ormanda oynamayı çok severdi. Bir gün, ormanın derinliklerinde parlak bir ışık gördü. Işığı takip ettiğinde, küçük bir kapı buldu.

Kapıyı açtığında, kendini büyülü bir dünyada buldu. Burada konuşan hayvanlar, dans eden çiçekler ve uçan mantarlar vardı. En ilginci ise, ağaçların gövdesinde yaşayan küçük insanlardı.

Küçük insanlar, Zeynep'i kraliçelerine götürdüler. Kraliçe, ormanın sırrını anlattı: Bu dünya, doğanın kalbiydi ve sadece saf kalpli çocuklar görebilirdi.

Zeynep, bu büyülü dünyada bir gün geçirdi. Hayvanlarla konuştu, çiçeklerle dans etti, mantarlarla uçtu. Akşam eve döndüğünde, bu sırrı kimseye anlatmadı. Ama her gün ormana gidip, büyülü dünyayı ziyaret etmeye devam etti.`,

    "Deniz Altı Dünyası": `Mehmet, yaz tatilinde deniz kenarında yaşayan dedesini ziyarete gitti. Bir gün, sahilde oynarken, suyun altından gelen bir ses duydu. Ses, onu denizin altına çağırıyordu.

Mehmet, suya daldığında kendini nefes alabildiği bir dünyada buldu. Burada balıklar konuşuyor, deniz yıldızları şarkı söylüyor, ahtapotlar dans ediyordu.

Deniz kralı, Mehmet'i sarayına davet etti. Saray, mercanlardan ve incilerden yapılmıştı. Kral, Mehmet'e deniz altı dünyasını gezdirdi. Dev kaplumbağaların üzerinde gezindiler, yunuslarla yüzdüler, deniz atlarıyla oyunlar oynadılar.

Mehmet, bu macerayı unutamadı. Her yaz tatilinde denize gittiğinde, suyun altındaki arkadaşlarını ziyaret etti. Onlarla oyunlar oynadı, şarkılar söyledi, danslar etti.`,

    "Büyülü Kutu": `Can, bir gün dedesinin evinde eski bir sandık buldu. Sandığın içinde, üzerinde garip semboller olan bir kutu vardı. Kutuyu açtığında, içinden bir peri çıktı.

Peri, Can'a üç dilek hakkı verdi. Can, ilk dileğinde uçabilmeyi istedi. İkinci dileğinde hayvanlarla konuşabilmeyi istedi. Üçüncü dileğinde ise, büyülü dünyayı görebilmeyi istedi.

Peri, Can'ın dileklerini gerçekleştirdi. Can, kuşlarla birlikte gökyüzünde uçtu, kedilerle ve köpeklerle sohbet etti, perilerin ve cinlerin dünyasını gördü.

Ama en sonunda Can, normal bir çocuk olmanın daha iyi olduğunu anladı. Periye son bir dilek diledi: Her şeyin eskisi gibi olmasını. Peri, bu dileği de gerçekleştirdi. Ama Can'ın anıları hala hafızasındaydı.`,

    "Gizemli Ada": `Ela, bir gün sahilde oynarken, denizde sürüklenen bir şişe buldu. Şişenin içinde bir harita vardı. Harita, yakındaki bir adayı gösteriyordu.

Ela, bir sandal bulup adaya gitti. Ada, haritada gösterildiği gibi gizemli bir yerdi. Burada konuşan ağaçlar, dans eden çiçekler ve şarkı söyleyen kuşlar vardı.

Adanın ortasında bir kale vardı. Kalenin içinde, yüzyıllardır orada yaşayan bir büyücü vardı. Büyücü, Ela'ya adanın sırrını anlattı: Bu ada, hayal gücünün gücünü simgeliyordu.

Ela, adada bir hafta geçirdi. Büyücüden sihir öğrendi, ağaçlarla konuştu, çiçeklerle dans etti. Eve döndüğünde, bu macerayı kimseye anlatmadı. Ama her gece rüyasında adaya geri döndü.`,

    "Zaman Yolculuğu": `Deniz, dedesinin garajında eski bir saat buldu. Saat, normal bir saat değildi. Üzerinde garip düğmeler ve ışıklar vardı. Deniz, düğmelerden birine bastığında, kendini geçmişte buldu.

Geçmişte, dedesinin çocukluğunu gördü. Dedesinin nasıl oyunlar oynadığını, nasıl okula gittiğini, nasıl arkadaşlarıyla vakit geçirdiğini izledi. Sonra başka bir düğmeye bastı ve geleceğe gitti.

Gelecekte, uçan arabalar, robotlar ve uzay kolonileri vardı. Deniz, gelecekteki teknolojileri gördü, robotlarla konuştu, uçan arabalarla gezdi.

Sonunda eve döndüğünde, saatin pili bitmişti. Ama Deniz, bu macerayı unutamadı. Her gün saati çalıştırmaya çalıştı, ama bir daha çalışmadı. Belki de, zaman yolculuğu sadece bir kez yapılabilirdi.`,
  };

  return (
    <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{story.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: story.backgroundColor }]}>
          <Image source={{ uri: story.image }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={[styles.storyTitle, { color: story.textColor }]}>
              {story.title}
            </Text>
            {story.author && (
              <View style={styles.authorContainer}>
                <MaterialCommunityIcons
                  name="account"
                  size={16}
                  color={story.textColor}
                />
                <Text style={[styles.author, { color: story.textColor }]}>
                  {story.author}
                </Text>
              </View>
            )}
            {story.category && (
              <View style={styles.categoryContainer}>
                <MaterialCommunityIcons
                  name="tag"
                  size={16}
                  color={story.textColor}
                />
                <Text style={[styles.category, { color: story.textColor }]}>
                  {story.category}
                </Text>
              </View>
            )}
            {story.readTime && (
              <View style={styles.readTimeContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={story.textColor}
                />
                <Text style={[styles.readTime, { color: story.textColor }]}>
                  {story.readTime}
                </Text>
              </View>
            )}
            <Text style={[styles.description, { color: story.textColor }]}>
              {story.description}
            </Text>
          </View>
        </View>

        <View style={styles.storyContent}>
          <Text style={styles.storyText}>
            {storyContents[story.title] ||
              "Hikaye içeriği burada yer alacak..."}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    objectFit: "contain",
  },
  cardContent: {
    padding: 15,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    marginLeft: 8,
  },
  readTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  readTime: {
    fontSize: 16,
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  storyContent: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
